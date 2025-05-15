import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useShop } from '../context/ShopContext';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart, addToWishlist, isInWishlist } = useShop();
  const inWishlist = isInWishlist(item.id);

  const handleIncrement = () => {
    updateQuantity(item.id, item.quantity + 1);
  };

  const handleDecrement = () => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1);
    } else {
      removeFromCart(item);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.price}>${item.price.toFixed(2)}</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity onPress={handleDecrement} style={styles.quantityButton}>
            <Icon name="minus" size={12} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.quantity}>{item.quantity}</Text>
          <TouchableOpacity onPress={handleIncrement} style={styles.quantityButton}>
            <Icon name="plus" size={12} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.actionButtons}>
        {!inWishlist && (
          <TouchableOpacity
            style={styles.wishlistButton}
            onPress={() => addToWishlist(item)}
          >
            <Icon name="heart-o" size={16} color="#f4511e" />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => removeFromCart(item)}
        >
          <Icon name="trash" size={16} color="#f4511e" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  image: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    marginRight: 10,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f4511e',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  quantityButton: {
    backgroundColor: '#f4511e',
    borderRadius: 15,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantity: {
    marginHorizontal: 12,
    fontSize: 16,
    fontWeight: '500',
  },
  actionButtons: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#f4511e',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  wishlistButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#f4511e',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
});

export default CartItem;
