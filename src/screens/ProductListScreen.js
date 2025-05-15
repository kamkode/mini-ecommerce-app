import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
} from 'react-native';
import { fetchProducts, fetchCategories } from '../services/api';
import ProductCard from '../components/ProductCard';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useShop } from '../context/ShopContext';

const ProductListScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [sortOption, setSortOption] = useState(null);
  const { cart, wishlist } = useShop();

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const wishlistCount = wishlist.length;

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          fetchProducts(),
          fetchCategories()
        ]);
        setProducts(productsData);
        setAllProducts(productsData);
        setCategories(categoriesData);
        setError(null);
      } catch (err) {
        setError('Failed to load products. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter products when category changes
  useEffect(() => {
    const filterProducts = async () => {
      if (selectedCategory) {
        try {
          setLoading(true);
          const categoryProducts = await fetchProducts(selectedCategory);
          setProducts(categoryProducts);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      } else if (allProducts.length > 0) {
        setProducts(allProducts);
      }
    };

    filterProducts();
  }, [selectedCategory]);

  // Filter products by search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      // If search is cleared, show category filtered products or all products
      if (selectedCategory) {
        const filterProducts = async () => {
          try {
            const categoryProducts = await fetchProducts(selectedCategory);
            setProducts(categoryProducts);
          } catch (err) {
            console.error(err);
          }
        };
        filterProducts();
      } else {
        setProducts(allProducts);
      }
      return;
    }

    const filtered = allProducts.filter(product =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setProducts(filtered);
  }, [searchQuery, allProducts]);

  // Sort products
  const sortProducts = (option) => {
    let sortedProducts = [...products];

    switch (option) {
      case 'price-low-high':
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-high-low':
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        sortedProducts.sort((a, b) => b.rating.rate - a.rating.rate);
        break;
      default:
        // Default sorting (by id)
        sortedProducts.sort((a, b) => a.id - b.id);
    }

    setProducts(sortedProducts);
    setSortOption(option);
    setSortModalVisible(false);
  };

  // Handle category selection
  const handleCategorySelect = (category) => {
    setSelectedCategory(category === 'all' ? null : category);
  };

  const handleProductPress = (product) => {
    navigation.navigate('ProductDetail', { productId: product.id, title: product.title });
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#f4511e" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            setLoading(true);
            setError(null);
            Promise.all([
              fetchProducts(),
              fetchCategories()
            ])
              .then(([productsData, categoriesData]) => {
                setProducts(productsData);
                setAllProducts(productsData);
                setCategories(categoriesData);
                setSelectedCategory(null);
                setSearchQuery('');
                setSortOption(null);
              })
              .catch(err => {
                setError('Failed to load products. Please try again later.');
                console.error(err);
              })
              .finally(() => {
                setLoading(false);
              });
          }}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header Actions */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Icon name="search" size={18} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Icon name="times" size={18} color="#999" />
            </TouchableOpacity>
          ) : null}
        </View>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate('Wishlist')}
          >
            <Icon name="heart" size={18} color="#f4511e" />
            {wishlistCount > 0 && (
              <View style={styles.badgeSmall}>
                <Text style={styles.badgeTextSmall}>{wishlistCount}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setSortModalVisible(true)}
          >
            <Icon name="sort" size={18} color="#f4511e" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScrollView}
        >
          <TouchableOpacity
            style={[styles.categoryButton, !selectedCategory && styles.selectedCategory]}
            onPress={() => handleCategorySelect('all')}
          >
            <Text style={[styles.categoryText, !selectedCategory && styles.selectedCategoryText]}>All</Text>
          </TouchableOpacity>

          {categories.map(category => (
            <TouchableOpacity
              key={category}
              style={[styles.categoryButton, selectedCategory === category && styles.selectedCategory]}
              onPress={() => handleCategorySelect(category)}
            >
              <Text
                style={[styles.categoryText, selectedCategory === category && styles.selectedCategoryText]}
                numberOfLines={1}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Products List */}
      <FlatList
        data={products}
        renderItem={({ item }) => (
          <ProductCard product={item} onPress={() => handleProductPress(item)} />
        )}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.productList}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="box-open" size={50} color="#ddd" />
            <Text style={styles.emptyText}>No products found</Text>
          </View>
        }
      />

      {/* Cart Button */}
      {cartItemCount > 0 && (
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => navigation.navigate('Cart')}
        >
          <Icon name="shopping-cart" size={20} color="#fff" />
          <Text style={styles.cartButtonText}>View Cart ({cartItemCount})</Text>
        </TouchableOpacity>
      )}

      {/* Sort Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={sortModalVisible}
        onRequestClose={() => setSortModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setSortModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Sort By</Text>

            <TouchableOpacity
              style={styles.sortOption}
              onPress={() => sortProducts('price-low-high')}
            >
              <Text style={styles.sortOptionText}>Price: Low to High</Text>
              {sortOption === 'price-low-high' && (
                <Icon name="check" size={16} color="#f4511e" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.sortOption}
              onPress={() => sortProducts('price-high-low')}
            >
              <Text style={styles.sortOptionText}>Price: High to Low</Text>
              {sortOption === 'price-high-low' && (
                <Icon name="check" size={16} color="#f4511e" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.sortOption}
              onPress={() => sortProducts('rating')}
            >
              <Text style={styles.sortOptionText}>Highest Rated</Text>
              {sortOption === 'rating' && (
                <Icon name="check" size={16} color="#f4511e" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.sortOption}
              onPress={() => sortProducts(null)}
            >
              <Text style={styles.sortOptionText}>Default</Text>
              {sortOption === null && (
                <Icon name="check" size={16} color="#f4511e" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSortModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  headerButtons: {
    flexDirection: 'row',
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginLeft: 8,
    position: 'relative',
  },
  badgeSmall: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#f4511e',
    borderRadius: 10,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeTextSmall: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  categoriesContainer: {
    backgroundColor: 'white',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  categoriesScrollView: {
    paddingHorizontal: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    marginRight: 10,
  },
  selectedCategory: {
    backgroundColor: '#f4511e',
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
  },
  selectedCategoryText: {
    color: 'white',
    fontWeight: 'bold',
  },
  productList: {
    paddingVertical: 8,
    paddingHorizontal: 4,
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
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  cartButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#f4511e',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  cartButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  sortOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sortOptionText: {
    fontSize: 16,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#f4511e',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProductListScreen;
