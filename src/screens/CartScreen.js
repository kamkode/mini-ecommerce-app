import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import CartItem from '../components/CartItem';
import { useShop } from '../context/ShopContext';
import Icon from 'react-native-vector-icons/FontAwesome';

const CartScreen = ({ navigation }) => {
  const { cart, total, clearCart, wishlist } = useShop();

  const handleClearCart = () => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to remove all items from your cart?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          onPress: () => clearCart(),
          style: 'destructive',
        },
      ]
    );
  };

  const handleCheckout = () => {
    Alert.alert(
      'Checkout',
      'This is a demo app. No actual purchase will be made.',
      [
        {
          text: 'OK',
          onPress: () => {
            // In a real app, you would process the order here
            clearCart();
            navigation.navigate('ProductList');
          },
        },
      ]
    );
  };

  if (cart.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Icon name="shopping-cart" size={64} color="#ddd" />
        <Text style={styles.emptyText}>Your cart is empty</Text>
        <TouchableOpacity
          style={styles.shopButton}
          onPress={() => navigation.navigate('ProductList')}
        >
          <Text style={styles.shopButtonText}>Start Shopping</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={cart}
        renderItem={({ item }) => <CartItem item={item} />}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
      />

      <View style={styles.summaryContainer}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Items:</Text>
          <Text style={styles.summaryValue}>
            {cart.reduce((sum, item) => sum + item.quantity, 0)}
          </Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Amount:</Text>
          <Text style={styles.summaryTotal}>${total.toFixed(2)}</Text>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClearCart}
          >
            <Text style={styles.clearButtonText}>Clear Cart</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={handleCheckout}
          >
            <Text style={styles.checkoutButtonText}>Checkout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  listContent: {
    paddingBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
    marginBottom: 24,
  },
  shopButton: {
    backgroundColor: '#f4511e',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  shopButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  summaryContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  summaryTotal: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f4511e',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  clearButton: {
    flex: 1,
    backgroundColor: 'white',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#f4511e',
  },
  clearButtonText: {
    color: '#f4511e',
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkoutButton: {
    flex: 2,
    backgroundColor: '#f4511e',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 8,
  },
  checkoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CartScreen;
