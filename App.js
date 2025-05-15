import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ShopProvider } from './src/context/ShopContext';
import ProductListScreen from './src/screens/ProductListScreen';
import ProductDetailScreen from './src/screens/ProductDetailScreen';
import CartScreen from './src/screens/CartScreen';
import WishlistScreen from './src/screens/WishlistScreen';
import { StatusBar } from 'react-native';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <ShopProvider>
      <NavigationContainer>
        <StatusBar backgroundColor="#fff" barStyle="dark-content" />
        <Stack.Navigator
          initialRouteName="ProductList"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#f4511e',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}>
          <Stack.Screen
            name="ProductList"
            component={ProductListScreen}
            options={{ title: 'Products' }}
          />
          <Stack.Screen
            name="ProductDetail"
            component={ProductDetailScreen}
            options={({ route }) => ({ title: route.params?.title || 'Product Detail' })}
          />
          <Stack.Screen
            name="Cart"
            component={CartScreen}
            options={{ title: 'Shopping Cart' }}
          />
          <Stack.Screen
            name="Wishlist"
            component={WishlistScreen}
            options={{ title: 'My Wishlist' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ShopProvider>
  );
};

export default App;
