import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  Image, 
  StyleSheet, 
  TouchableOpacity,
  ActivityIndicator 
} from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  const BaseImage = "https://image.tmdb.org/t/p/w500";
  
  const getData = async () => {
    try {
      const response = await axios.get(
        "https://api.themoviedb.org/3/movie/popular",
        {
          headers: {
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiY2FiMWMxM2EzOGMxYWNiNDE1MTY5ODE4NWYyY2RhMyIsIm5iZiI6MTczODgyNTE1My4wNTksInN1YiI6IjY3YTQ1ZGMxNGRjMDUyYmE1NTg1YjU1ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.VwOh-2385UzjNhXsD1hBEdzqdccDXl1tfaK9YAvNd5w'
          }
        }
      );
      setMovies(response.data.results);
      setLoading(false);
    } catch (err) {
      setError('Terjadi kesalahan saat mengambil data');
      setLoading(false);
      console.error(err);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleMoviePress = (movieId) => {
    router.push(`./${movieId}`);
};

  const renderMovieItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.movieCard}
      onPress={() => handleMoviePress(item.id)}
    >
      <Image
        source={{ uri: `${BaseImage}${item.poster_path}` }}
        style={styles.poster}
      />
      <View style={styles.movieInfo}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.rating}>
          Rating: ⭐ {item.vote_average.toFixed(1)}
        </Text>
        <Text style={styles.releaseDate}>
          Rilis: {item.release_date}
        </Text>
        <Text style={styles.overview} numberOfLines={3}>
          {item.overview}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>KONTOL Terpopuler saat ini</Text>
      <FlatList
        data={movies}
        renderItem={renderMovieItem}
        keyExtractor={item => item.id.toString()}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 15,
    textAlign: 'center',
  },
  movieCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 15,
    padding: 10,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  poster: {
    width: 100,
    height: 150,
    borderRadius: 8,
  },
  movieInfo: {
    flex: 1,
    marginLeft: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  rating: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  releaseDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  overview: {
    fontSize: 14,
    color: '#444',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default MovieList;