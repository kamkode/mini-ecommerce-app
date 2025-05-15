import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { fetchProductById } from '../services/api';
import RatingStars from '../components/RatingStars';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useShop } from '../context/ShopContext';

const ProductDetailScreen = ({ route, navigation }) => {
  const { productId } = route.params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart, cart, addToWishlist, removeFromWishlist, isInWishlist } = useShop();

  // Check if product is already in cart
  const productInCart = cart.find(item => item.id === productId);
  const cartQuantity = productInCart ? productInCart.quantity : 0;
  const productInWishlist = isInWishlist(productId);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const data = await fetchProductById(productId);
        setProduct(data);
        setError(null);
      } catch (err) {
        setError('Failed to load product details. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  const handleAddToCart = () => {
    addToCart(product);
  };

  const handleViewCart = () => {
    navigation.navigate('Cart');
  };

  const toggleWishlist = () => {
    if (productInWishlist) {
      removeFromWishlist(product);
    } else {
      addToWishlist(product);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#f4511e" />
      </View>
    );
  }

  if (error || !product) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error || 'Product not found'}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: product.image }} style={styles.image} />
      </View>
      <View style={styles.detailsContainer}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{product.title}</Text>
          <TouchableOpacity
            style={[styles.wishlistButton, productInWishlist && styles.wishlistButtonActive]}
            onPress={toggleWishlist}
          >
            <Icon
              name={productInWishlist ? 'heart' : 'heart-o'}
              size={20}
              color={productInWishlist ? '#fff' : '#f4511e'}
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.price}>${product.price.toFixed(2)}</Text>

        <View style={styles.ratingContainer}>
          <RatingStars rating={product.rating.rate} size={18} />
          <Text style={styles.ratingText}>
            {product.rating.rate.toFixed(1)} ({product.rating.count} reviews)
          </Text>
        </View>

        <Text style={styles.categoryLabel}>Category</Text>
        <Text style={styles.category}>{product.category}</Text>

        <Text style={styles.descriptionLabel}>Description</Text>
        <Text style={styles.description}>{product.description}</Text>

        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.addToCartButton}
            onPress={handleAddToCart}
          >
            <Text style={styles.addToCartButtonText}>
              {cartQuantity > 0
                ? `Add More (${cartQuantity} in cart)`
                : 'Add to Cart'}
            </Text>
          </TouchableOpacity>

          <View style={styles.secondaryButtons}>
            {cartQuantity > 0 && (
              <TouchableOpacity
                style={styles.viewCartButton}
                onPress={handleViewCart}
              >
                <Text style={styles.viewCartButtonText}>View Cart</Text>
              </TouchableOpacity>
            )}

            {productInWishlist && (
              <TouchableOpacity
                style={styles.viewWishlistButton}
                onPress={() => navigation.navigate('Wishlist')}
              >
                <Text style={styles.viewWishlistButtonText}>View Wishlist</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#f4511e',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  imageContainer: {
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
    padding: 20,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  detailsContainer: {
    padding: 16,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 10,
  },
  wishlistButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#f4511e',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  wishlistButtonActive: {
    backgroundColor: '#f4511e',
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f4511e',
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  categoryLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    color: '#666',
    textTransform: 'capitalize',
    marginBottom: 16,
  },
  descriptionLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: '#333',
    marginBottom: 24,
  },
  actionContainer: {
    marginTop: 8,
  },
  addToCartButton: {
    backgroundColor: '#f4511e',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  addToCartButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  viewCartButton: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f4511e',
    marginRight: 8,
  },
  viewCartButtonText: {
    color: '#f4511e',
    fontSize: 16,
    fontWeight: 'bold',
  },
  viewWishlistButton: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f4511e',
    marginLeft: 8,
  },
  viewWishlistButtonText: {
    color: '#f4511e',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProductDetailScreen;
