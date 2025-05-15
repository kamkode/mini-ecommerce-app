import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useShop } from '../context/ShopContext';

const WishlistScreen = ({ navigation }) => {
  const { wishlist, removeFromWishlist, addToCart } = useShop();

  const handleRemoveFromWishlist = (product) => {
    removeFromWishlist(product);
  };

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  const handleProductPress = (product) => {
    navigation.navigate('ProductDetail', { productId: product.id, title: product.title });
  };

  if (wishlist.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Icon name="heart" size={64} color="#ddd" />
        <Text style={styles.emptyText}>Your wishlist is empty</Text>
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
        data={wishlist}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.wishlistItem}>
            <TouchableOpacity 
              style={styles.imageContainer}
              onPress={() => handleProductPress(item)}
            >
              <Image source={{ uri: item.image }} style={styles.image} />
            </TouchableOpacity>
            <View style={styles.infoContainer}>
              <TouchableOpacity onPress={() => handleProductPress(item)}>
                <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
              </TouchableOpacity>
              <Text style={styles.price}>${item.price.toFixed(2)}</Text>
              <View style={styles.buttonsContainer}>
                <TouchableOpacity 
                  style={styles.addToCartButton}
                  onPress={() => handleAddToCart(item)}
                >
                  <Icon name="shopping-cart" size={14} color="#fff" />
                  <Text style={styles.buttonText}>Add to Cart</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.removeButton}
                  onPress={() => handleRemoveFromWishlist(item)}
                >
                  <Icon name="trash" size={14} color="#f4511e" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
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
  wishlistItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  imageContainer: {
    width: 100,
    height: 100,
    padding: 10,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  infoContainer: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f4511e',
    marginBottom: 8,
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addToCartButton: {
    backgroundColor: '#f4511e',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginRight: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  removeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#f4511e',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default WishlistScreen;
