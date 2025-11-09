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
        <ActivityIndicator size="large" color="#6A5AE0" />
        <Text style={styles.loadingText}>Memuat detail film...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={getMovieDetail}>
          <Text style={styles.retryText}>Coba Lagi</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!movie) return null;

  // Format currency values to display in appropriate format (e.g. $10,000,000)
  const formatCurrency = (value) => {
    if (!value || value === 0) return 'Tidak tersedia';
    return `$${value.toLocaleString()}`;
  };

  return (
    <ScrollView style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backText}>← Kembali</Text>
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
          <Text style={styles.popularity}>Popularty: 🔥 {movie.popularity.toFixed(1)}</Text>
          <Text style={styles.date}>Release: {movie.release_date}</Text>
          <Text style={styles.runtime}>Time: {movie.runtime} menit</Text>
          <Text style={styles.status}>Status: {movie.status}</Text>
          <Text style={styles.genres}>
            Genre: {movie.genres?.map(genre => genre.name).join(', ')}
          </Text>
        </View>
      </View>
      
      <View style={styles.financialContainer}>
        <Text style={styles.sectionTitle}>Informasi Finansial</Text>
        <View style={styles.financialItem}>
          <Text style={styles.financialLabel}>Budget:</Text>
          <Text style={styles.financialValue}>{formatCurrency(movie.budget)}</Text>
        </View>
        <View style={styles.financialItem}>
          <Text style={styles.financialLabel}>Revuene:</Text>
          <Text style={styles.financialValue}>{formatCurrency(movie.revenue)}</Text>
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
    backgroundColor: '#121212',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
    height: '100%',
    padding: 20,
  },
  loadingText: {
    marginTop: 15,
    color: '#ffffff',
    fontSize: 16,
  },
  error: {
    color: '#FF5252',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#6A5AE0',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 15,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    zIndex: 10,
  },
  backText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '500',
  },
  backdrop: {
    width: '100%',
    height: 250,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  contentContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#1E1E1E',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
  },
  poster: {
    width: 120,
    height: 180,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ffffff',
    marginRight: 15,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  rating: {
    fontSize: 15,
    color: '#FFC107',
    marginBottom: 5,
    fontWeight: '500',
  },
  popularity: {
    fontSize: 15,
    color: '#FF6B6B',
    marginBottom: 5,
    fontWeight: '500',
  },
  date: {
    fontSize: 14,
    color: '#B3B3B3',
    marginBottom: 5,
  },
  runtime: {
    fontSize: 14,
    color: '#B3B3B3',
    marginBottom: 5,
  },
  status: {
    fontSize: 14,
    color: '#4CAF50',
    marginBottom: 5,
    fontWeight: '500',
  },
  genres: {
    fontSize: 14,
    color: '#B3B3B3',
    marginBottom: 5,
  },
  financialContainer: {
    padding: 15,
    marginTop: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#6A5AE0',
    paddingLeft: 10,
  },
  financialItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  financialLabel: {
    fontSize: 15,
    color: '#B3B3B3',
    fontWeight: '500',
  },
  financialValue: {
    fontSize: 15,
    color: '#4FC3F7',
    fontWeight: '500',
  },
  overviewContainer: {
    backgroundColor: '#121212',
    padding: 20,
    paddingTop: 5,
  },
  overviewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#6A5AE0',
    paddingLeft: 10,
  },
  overview: {
    fontSize: 15,
    color: '#E0E0E0',
    lineHeight: 22,
    textAlign: 'justify',
  }
});

export default MovieDetail;