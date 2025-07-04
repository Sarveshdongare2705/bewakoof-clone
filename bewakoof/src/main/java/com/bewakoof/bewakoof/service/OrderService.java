package com.bewakoof.bewakoof.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collector;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.bewakoof.bewakoof.enums.OrderStatus;
import com.bewakoof.bewakoof.enums.PaymentStatus;
import com.bewakoof.bewakoof.model.Address;
import com.bewakoof.bewakoof.model.AppUser;
import com.bewakoof.bewakoof.model.Cart;
import com.bewakoof.bewakoof.model.CartItem;
import com.bewakoof.bewakoof.model.ColorVariant;
import com.bewakoof.bewakoof.model.Order;
import com.bewakoof.bewakoof.model.OrderItem;
import com.bewakoof.bewakoof.model.Product;
import com.bewakoof.bewakoof.model.ProductAvailability;
import com.bewakoof.bewakoof.model.SizeVariant;
import com.bewakoof.bewakoof.repository.CartItemRepository;
import com.bewakoof.bewakoof.repository.CartRepository;
import com.bewakoof.bewakoof.repository.OrderItemRepository;
import com.bewakoof.bewakoof.repository.OrderRepository;
import com.bewakoof.bewakoof.repository.ProductRepository;
import com.bewakoof.bewakoof.repository.UserRepository;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private OrderItemRepository orderItemRepository;
    @Autowired
    private CartRepository cartRepository;
    @Autowired
    private CartItemRepository cartItemRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ProductRepository productRepository;

    // getting users orders
    public List<Order> getUserOrders(UserDetails userDetails) {
        AppUser user = userRepository.findByEmail(userDetails.getUsername());
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }

        return orderRepository.findByUser_UserId(user.getUserId());
    }

    // placing order
    public boolean placeOrder(UserDetails userDetails, String paymentMethod) {
        AppUser user = userRepository.findByEmail(userDetails.getUsername());
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "User does not exist");
        }
        Cart cart = cartRepository.findByAppUser_UserId(user.getUserId()).orElse(null);
        if (cart == null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Cart not found");
        }
        if (cart.getCartItems() == null || cart.getCartItems().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Cart is Empty");
        }
        if (cart.getSelectedAddress() == null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "No delivery address found");
        }

        // all ok create new order
        Order order = new Order();
        order.setUser(user);
        order.setTotalQuantity(cart.getTotalQuantity());
        order.setSubtotal(cart.getSubtotal());
        order.setTotalDeliveryCharge(cart.getTotalDeliveryCharge());
        order.setCouponDiscount(cart.getCouponDiscount());
        order.setShippingDiscount(cart.getShippingDiscount());
        order.setFinalAmount(cart.getFinalAmount());

        order.setPaymentMethod(paymentMethod);
        order.setPaymentSuccess(false);
        order.setPaymentId(null);
        order.setOrderStatus(OrderStatus.PLACED);
        order.setPaymentStatus(PaymentStatus.PENDING);

        Address addr = cart.getSelectedAddress();
        order.setAddressType(addr.getAddressType().name());
        order.setPhone(addr.getPhone());
        order.setStreet(addr.getStreet());
        order.setLandmark(addr.getLandmark());
        order.setCity(addr.getCity());
        order.setState(addr.getState());
        order.setCountry(addr.getCountry());
        order.setPincode(String.valueOf(addr.getPincode()));

        List<OrderItem> orderItems = cart.getCartItems().stream().map(
                item -> {
                    Product p = item.getProduct();
                    ProductAvailability avail = item.getProductAvailability();

                    OrderItem orderItem = new OrderItem();
                    orderItem.setOrder(order);
                    orderItem.setProductId(p.getProductId());
                    orderItem.setProductName(p.getProductName());
                    orderItem.setProductImageUrl(item.getColorVariant().getImages().get(0).getUrl());
                    orderItem.setColorName(item.getColorVariant().getColorName());
                    orderItem.setSizeLabel(item.getSizeVariant().getSize());
                    orderItem.setQuantity(item.getQuantity());
                    orderItem.setPricePerUnit(p.getDiscountPrice());
                    orderItem.setTotalPrice(p.getDiscountPrice() * item.getQuantity());
                    orderItem.setDeliveryCharge(avail.getDeliveryCharge());
                    orderItem.setEstimatedDeliveryDays(avail.getEstimatedDeliveryDays());
                    orderItem.setReturnDays(avail.getReturnDays());

                    return orderItem;
                }).collect(Collectors.toList());

        order.setOrderItems(orderItems);

        int totalDays = orderItems.stream()
                .mapToInt(OrderItem::getEstimatedDeliveryDays)
                .max()
                .orElse(5);

        order.setOrderDate(LocalDateTime.now());
        order.setExpectedDeliveryDate(LocalDateTime.now().plusDays(totalDays));

        // Generate order code like "ORD20250702ABC"
        String datePart = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String randomPart = generateRandomAlphaNumeric(5); // Use uppercase 3-char random code
        String orderCode = "ORD" + datePart + randomPart;
        order.setOrderCode(orderCode);

        Order placedOrder = orderRepository.save(order);
        if (placedOrder != null) {
            // reduce quantity
            reduceQuantity(cart);
            clearUserCart(user);
            return true;
        }
        return false;
    }

    public void cancelOrder(UserDetails userDetails, Long orderId) {
        AppUser user = userRepository.findByEmail(userDetails.getUsername());
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));

        // Ensure the order belongs to the user
        if (!order.getUser().getUserId().equals(user.getUserId())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "You are not authorized to cancel this order");
        }

        // Check if order is already delivered or cancelled
        if (order.getOrderStatus() == OrderStatus.DELIVERED || order.getOrderStatus() == OrderStatus.CANCELLED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Order cannot be cancelled");
        }

        // Set status
        order.setOrderStatus(OrderStatus.CANCELLED);

        // Refund if payment was completed
        if (order.getPaymentStatus() == PaymentStatus.COMPLETED) {
            processRefund(order);
        }

        orderRepository.save(order);
    }

    private void processRefund(Order order) {
        System.out.println("Refund initiated for paymentId: " + order.getPaymentId());

        order.setPaymentStatus(PaymentStatus.REFUND_INITIATED);
    }

    // helper function
    private void clearUserCart(AppUser user) {
        Cart cart = cartRepository.findByAppUser_UserId(user.getUserId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cart not found"));

        // Delete all cart items
        cartItemRepository.deleteAll(cart.getCartItems());

        // Clear cart totals and address
        cart.getCartItems().clear(); // clear reference
        cart.setSubtotal(0.0);
        cart.setTotalDeliveryCharge(0.0);
        cart.setCouponDiscount(0.0);
        cart.setShippingDiscount(0.0);
        cart.setMerchandiseTotal(0.0);
        cart.setFinalAmount(0.0);
        cart.setTotalQuantity(0);
        cart.setAppliedCoupon(null);

        cartRepository.save(cart);
    }

    private void reduceQuantity(Cart cart) {
        for (CartItem item : cart.getCartItems()) {
            Product product = item.getProduct();
            String selectedColor = item.getColorVariant().getColorName();
            String selectedSize = item.getSizeVariant().getSize();
            int quantityOrdered = item.getQuantity();

            ColorVariant matchingColorVariant = product.getColorVariants().stream()
                    .filter(color -> color.getColorName().equalsIgnoreCase(selectedColor))
                    .findFirst()
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                            "Color " + selectedColor + " not found for product : " + product.getProductName()));
            SizeVariant matchingSizeVariant = matchingColorVariant.getSizes().stream()
                    .filter(size -> size.getSize().equalsIgnoreCase(selectedSize))
                    .findFirst()
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                            "Size" + selectedSize + " not found for color : "
                                    + selectedColor + " for product : " + product.getProductName()));

            int currentQuantity = matchingSizeVariant.getQuantity();
            if (currentQuantity < quantityOrdered) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Product out of stock : " + product.getProductName() + ". Only " + currentQuantity
                                + " peices(s) left.");
            }
            matchingSizeVariant.setQuantity(currentQuantity - quantityOrdered);
            matchingSizeVariant.setAvailable(matchingSizeVariant.getQuantity() > 0);
            productRepository.save(product);
        }
    }

    private String generateRandomAlphaNumeric(int length) {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < length; i++) {
            int randomIndex = (int) (Math.random() * chars.length());
            sb.append(chars.charAt(randomIndex));
        }
        return sb.toString();
    }

}
