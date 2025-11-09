import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  Image, 
  StyleSheet, 
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  TextInput 
} from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();

  const BaseImage = "https://image.tmdb.org/t/p/w500";
  const API_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiY2FiMWMxM2EzOGMxYWNiNDE1MTY5ODE4NWYyY2RhMyIsIm5iZiI6MTczODgyNTE1My4wNTksInN1YiI6IjY3YTQ1ZGMxNGRjMDUyYmE1NTg1YjU1ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.VwOh-2385UzjNhXsD1hBEdzqdccDXl1tfaK9YAvNd5w';
  
  const getPopularMovies = async () => {
    try {
      const response = await axios.get(
        "https://api.themoviedb.org/3/movie/popular",
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`
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

  const searchMovies = async (query) => {
    if (!query.trim()) {
      getPopularMovies();
      return;
    }

    setIsSearching(true);
    try {
      const response = await axios.get(
        "https://api.themoviedb.org/3/search/movie",
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`
          },
          params: {
            query: query,
            include_adult: false,
            language: 'id-ID'
          }
        }
      );
      setMovies(response.data.results);
      setIsSearching(false);
    } catch (err) {
      setError('Terjadi kesalahan saat mencari film');
      setIsSearching(false);
      console.error(err);
    }
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text.length > 2) {
      searchMovies(text);
    } else if (text.length === 0) {
      getPopularMovies();
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    getPopularMovies();
  };

  useEffect(() => {
    getPopularMovies();
  }, []);

  const handleMoviePress = (movieId) => {
    router.push(`./${movieId}`);
  };

  const renderMovieItem = ({ item }) => {
    // Check if poster path exists, if not use a placeholder
    const posterUri = item.poster_path 
      ? `${BaseImage}${item.poster_path}`
      : 'https://via.placeholder.com/120x180?text=No+Image';
    
    // Safe rating display - handle undefined vote_average
    const rating = item.vote_average !== undefined && item.vote_average !== null
      ? item.vote_average.toFixed(1)
      : 'N/A';

    return (
      <TouchableOpacity 
        style={styles.movieCard}
        onPress={() => handleMoviePress(item.id)}
      >
        <View style={styles.posterContainer}>
          <Image
            source={{ uri: posterUri }}
            style={styles.poster}
            resizeMode="cover"
          />
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingText}>
              {rating} {rating !== 'N/A' ? '⭐' : ''}
            </Text>
          </View>
        </View>
        <View style={styles.movieInfo}>
          <Text style={styles.title} numberOfLines={2}>
            {item.title || 'Judul Tidak Tersedia'}
          </Text>
          <Text style={styles.releaseDate}>
            Rilis: {item.release_date || 'Tidak tersedia'}
          </Text>
          <Text style={styles.overview} numberOfLines={3}>
            {item.overview || 'Tidak ada deskripsi untuk film ini.'}
          </Text>
          <View style={styles.detailButton}>
            <Text style={styles.detailButtonText}>Lihat Detail</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        {searchQuery ? 'Tidak ada film yang ditemukan' : 'Tidak ada film yang tersedia'}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <StatusBar barStyle="light-content" backgroundColor="#121212" />
        <ActivityIndicator size="large" color="#6A5AE0" />
        <Text style={styles.loadingText}>Memuat film...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <StatusBar barStyle="light-content" backgroundColor="#121212" />
        <Text style={styles.error}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={getPopularMovies}>
          <Text style={styles.retryButtonText}>Coba Lagi</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Movie Terpopuler</Text>
        <Text style={styles.subheader}>Temukan film-film populer saat ini</Text>
      </View>
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#B3B3B3" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari film..."
            placeholderTextColor="#B3B3B3"
            value={searchQuery}
            onChangeText={handleSearch}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch}>
              <Ionicons name="close-circle" size={20} color="#B3B3B3" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      {isSearching ? (
        <View style={styles.searchingContainer}>
          <ActivityIndicator size="small" color="#6A5AE0" />
          <Text style={styles.searchingText}>Mencari film...</Text>
        </View>
      ) : (
        <FlatList
          data={movies}
          renderItem={renderMovieItem}
          keyExtractor={item => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.listContent,
            movies.length === 0 && styles.emptyListContent
          ]}
          ListEmptyComponent={renderEmptyList}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingTop: 50,
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  subheader: {
    fontSize: 14,
    color: '#B3B3B3',
    marginBottom: 10,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#121212',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
    borderRadius: 16,
    paddingHorizontal: 12,
    height: 46,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    height: '100%',
  },
  searchingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  searchingText: {
    color: '#FFFFFF',
    marginLeft: 10,
    fontSize: 16,
  },
  listContent: {
    padding: 16,
    paddingTop: 10,
  },
  emptyListContent: {
    flex: 1,
  },
  movieCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    flexDirection: 'row',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  posterContainer: {
    position: 'relative',
  },
  poster: {
    width: 120,
    height: 180,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    backgroundColor: '#2A2A2A', // Placeholder color
  },
  ratingBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    color: '#FFC107',
    fontSize: 12,
    fontWeight: 'bold',
  },
  movieInfo: {
    flex: 1,
    padding: 14,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  releaseDate: {
    fontSize: 13,
    color: '#B3B3B3',
    marginBottom: 8,
  },
  overview: {
    fontSize: 14,
    color: '#E0E0E0',
    lineHeight: 20,
    marginBottom: 10,
  },
  detailButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#6A5AE0',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginTop: 'auto',
  },
  detailButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  loadingText: {
    marginTop: 12,
    color: '#FFFFFF',
    fontSize: 16,
  },
  error: {
    color: '#FF5252',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  retryButton: {
    backgroundColor: '#6A5AE0',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: '#B3B3B3',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default MovieList;