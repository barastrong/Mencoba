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
import axios from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router';

const MovieDetail = () => {
  const { movieId } = useLocalSearchParams();
  const [movie, setMovie] = useState(null);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BaseImage = "https://image.tmdb.org/t/p/w500";

  const getMovieDetail = async () => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/${movieId}`,
        {
          headers: {
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiY2FiMWMxM2EzOGMxYWNiNDE1MTY5ODE4NWYyY2RhMyIsIm5iZiI6MTczODgyNTE1My4wNTksInN1YiI6IjY3YTQ1ZGMxNGRjMDUyYmE1NTg1YjU1ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.VwOh-2385UzjNhXsD1hBEdzqdccDXl1tfaK9YAvNd5w'
          }
        }
      );
      setMovie(response.data);
      setLoading(false);
    } catch (err) {
      setError('Terjadi kesalahan saat mengambil detail film');
      setLoading(false);
      console.error(err);
    }
  };

  useEffect(() => {
    getMovieDetail();
  }, [movieId]);

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

  if (!movie) return null;

  return (
    <ScrollView style={styles.container}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>
      <Image
        source={{ uri: `${BaseImage}${movie.backdrop_path}` }}
        style={styles.backdrop}
      />
      <View style={styles.contentContainer}>
        <Image
          source={{ uri: `${BaseImage}${movie.poster_path}` }}
          style={styles.poster}
        />
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{movie.title}</Text>
          <Text style={styles.rating}>Rating: ⭐ {movie.vote_average.toFixed(1)}</Text>
          <Text style={styles.date}>Rilis: {movie.release_date}</Text>
          <Text style={styles.runtime}>Durasi: {movie.runtime} menit</Text>
          <Text style={styles.genres}>
            Genre: {movie.genres?.map(genre => genre.name).join(', ')}
          </Text>
        </View>
      </View>
      <View style={styles.overviewContainer}>
        <Text style={styles.overviewTitle}>Sinopsis</Text>
        <Text style={styles.overview}>{movie.overview}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  backButton: {
    padding: 10,
    marginBottom: 10,
  },
  backText: {
    fontSize: 18,
    color: 'blue',
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

export default MovieDetail;