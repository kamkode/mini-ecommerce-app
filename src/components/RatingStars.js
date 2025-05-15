import React from 'react';
import { View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const RatingStars = ({ rating, size = 12 }) => {
  // Convert rating to array of 5 stars
  const stars = [];
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  // Add full stars
  for (let i = 0; i < fullStars; i++) {
    stars.push(<Icon key={`full-${i}`} name="star" size={size} color="#FFD700" />);
  }

  // Add half star if needed
  if (halfStar) {
    stars.push(<Icon key="half" name="star-half-o" size={size} color="#FFD700" />);
  }

  // Add empty stars
  for (let i = 0; i < emptyStars; i++) {
    stars.push(<Icon key={`empty-${i}`} name="star-o" size={size} color="#FFD700" />);
  }

  return <View style={styles.container}>{stars}</View>;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
});

export default RatingStars;
