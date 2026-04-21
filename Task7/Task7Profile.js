import 'react-native-url-polyfill/auto';
import { registerRootComponent } from 'expo';
import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Image, FlatList, TouchableOpacity,
  ScrollView, Animated, Dimensions, Modal, ImageBackground, TextInput, Alert
} from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons, Octicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const THEME = {
  bgPurple: '#120D1D',
  lavender: '#C5B4E3',
  beige: '#D2B48C',
  deepPurple: '#7B337E',
  textWhite: '#FFFFFF',
};

const BG_IMAGE = 'https://i.pinimg.com/originals/ba/43/61/ba43610996846f48a73599981442f494.jpg';
const API_URL = 'http://192.168.0.104/leohub_api';

export default function ProfileScreen() {
  const [userData, setUserData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    bio: '',
    location: '',
    website: ''
  });

  const [posts] = useState(Array.from({ length: 15 }, (_, i) => ({
    id: i,
    image: `https://picsum.photos/id/${i + 60}/600/600`,
    caption: `Elegant Zalene Creation #${i + 1}.`
  })));

  // States for Sub-pages
  const [activeModal, setActiveModal] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const animValue = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(height)).current;

  useEffect(() => {
    fetchProfile();
    Animated.timing(fadeAnim, { toValue: 1, duration: 1200, useNativeDriver: true }).start();
  }, []);

  const fetchProfile = async () => {
    try {
      let res = await fetch(`${API_URL}/get_profile.php`);
      let data = await res.json();
      if (data.success && data.user) {
        setUserData(data.user);
        setEditForm({
          full_name: data.user.full_name || '',
          email: data.user.email || '',
          phone: data.user.phone || '',
          bio: data.user.bio || '',
          location: data.user.location || '',
          website: data.user.website || ''
        });
      }
    } catch (e) {
      console.log("Connection Error", e);
      Alert.alert("Error", "Failed to fetch profile data");
    }
  };

  const updateProfile = async () => {
    try {
      let res = await fetch(`${API_URL}/update_profile.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      });
      let data = await res.json();
      if (data.success) {
        Alert.alert("Success", "Profile updated successfully!");
        setEditMode(false);
        fetchProfile();
      } else {
        Alert.alert("Error", "Failed to update profile");
      }
    } catch (e) {
      Alert.alert("Error", "Network error");
    }
  };

  const triggerModal = (type, data = null) => {
    setSelectedPost(data);
    setActiveModal(type);
    animValue.setValue(0);
    Animated.spring(animValue, {
      toValue: 1,
      friction: 8,
      useNativeDriver: true
    }).start();
  };

  const closeModal = () => {
    Animated.timing(animValue, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => {
      setActiveModal(null);
    });
  };

  // Edit Profile Modal
  const EditProfileModal = () => (
    <Modal visible={editMode} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <Animated.View style={[styles.editContainer, { transform: [{ translateY: slideAnim }] }]}>
          <ImageBackground source={{ uri: BG_IMAGE }} style={styles.subPageBg} imageStyle={{ opacity: 0.2 }}>
            <View style={styles.subPageHeader}>
              <Text style={styles.subPageTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setEditMode(false)}>
                <Ionicons name="close-circle" size={32} color={THEME.lavender} />
              </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={{ padding: 20 }}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput
                style={styles.input}
                value={editForm.full_name}
                onChangeText={(text) => setEditForm({ ...editForm, full_name: text })}
                placeholderTextColor="#888"
              />

              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                value={editForm.email}
                onChangeText={(text) => setEditForm({ ...editForm, email: text })}
                keyboardType="email-address"
                placeholderTextColor="#888"
              />

              <Text style={styles.inputLabel}>Phone</Text>
              <TextInput
                style={styles.input}
                value={editForm.phone}
                onChangeText={(text) => setEditForm({ ...editForm, phone: text })}
                keyboardType="phone-pad"
                placeholderTextColor="#888"
              />

              <Text style={styles.inputLabel}>Bio</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={editForm.bio}
                onChangeText={(text) => setEditForm({ ...editForm, bio: text })}
                multiline
                numberOfLines={3}
                placeholderTextColor="#888"
              />

              <Text style={styles.inputLabel}>Location</Text>
              <TextInput
                style={styles.input}
                value={editForm.location}
                onChangeText={(text) => setEditForm({ ...editForm, location: text })}
                placeholderTextColor="#888"
              />

              <Text style={styles.inputLabel}>Website</Text>
              <TextInput
                style={styles.input}
                value={editForm.website}
                onChangeText={(text) => setEditForm({ ...editForm, website: text })}
                placeholderTextColor="#888"
              />

              <TouchableOpacity style={styles.saveBtn} onPress={updateProfile}>
                <Text style={styles.saveBtnText}>Save Changes</Text>
              </TouchableOpacity>
            </ScrollView>
          </ImageBackground>
        </Animated.View>
      </View>
    </Modal>
  );

  const SubPage = ({ title, children }) => (
    <Modal visible={!!activeModal} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <Animated.View style={[styles.subPageContainer, { transform: [{ scale: animValue }] }]}>
          <ImageBackground source={{ uri: BG_IMAGE }} style={styles.subPageBg} imageStyle={{ opacity: 0.2 }}>
            <View style={styles.subPageHeader}>
              <Text style={styles.subPageTitle}>{title}</Text>
              <TouchableOpacity onPress={closeModal}>
                <Ionicons name="close-circle" size={32} color={THEME.lavender} />
              </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={{ padding: 20 }}>
              {children}
            </ScrollView>
          </ImageBackground>
        </Animated.View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.mainWrapper}>
      <ImageBackground source={{ uri: BG_IMAGE }} style={styles.fullScreenBg} blurRadius={1}>
        <View style={styles.darkOverlay}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity onPress={() => triggerModal('Create Post')} style={styles.headerLeft}>
                <Ionicons name="add-outline" size={30} color="white" />
                <Text style={styles.headerUsername}>{userData?.username || 'yashfa_javed'}</Text>
                <Ionicons name="chevron-down" size={16} color="white" />
              </TouchableOpacity>
              <View style={styles.headerRight}>
                <TouchableOpacity onPress={() => triggerModal('Threads / Zalene Activity')}>
                  <MaterialCommunityIcons name="at" size={26} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => triggerModal('Settings')}>
                  <Feather name="menu" size={28} color="white" style={{ marginLeft: 15 }} />
                </TouchableOpacity>
              </View>
            </View>

            <Animated.View style={{ opacity: fadeAnim }}>
              {/* Profile Section */}
              <View style={styles.centeredProfile}>
                <View style={styles.profilePicWrapper}>
                  <Image
                    source={{ uri: userData?.avatar_url || 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200' }}
                    style={styles.profilePic}
                  />
                  {userData?.is_verified && (
                    <View style={styles.verifiedBadge}>
                      <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                    </View>
                  )}
                </View>
                <Text style={styles.fullName}>{userData?.full_name || '🌸 يشفیٰ جاوید 🌸'}</Text>
                <Text style={styles.bioText}>{userData?.bio || 'Digital Artist | Lavender Soul ✨\nZalene Luxury Brand Owner'}</Text>
                {userData?.location && (
                  <View style={styles.locationRow}>
                    <Ionicons name="location-outline" size={14} color="#999" />
                    <Text style={styles.locationText}>{userData.location}</Text>
                  </View>
                )}
              </View>

              {/* Stats Bar (Workable) */}
              <TouchableOpacity onPress={() => triggerModal('Account Stats')} style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Text style={styles.statNum}>{userData?.posts_count || 156}</Text>
                  <Text style={styles.statLabel}>Posts</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNum}>{userData?.followers_count || 12500}</Text>
                  <Text style={styles.statLabel}>Followers</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNum}>{userData?.following_count || 480}</Text>
                  <Text style={styles.statLabel}>Following</Text>
                </View>
              </TouchableOpacity>

              {/* Buttons (Workable) */}
              <View style={styles.buttonRow}>
                <TouchableOpacity onPress={() => setEditMode(true)} style={[styles.editBtn, { backgroundColor: '#333' }]}>
                  <Text style={styles.editBtnText}>Edit Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => triggerModal('Share Profile')} style={[styles.editBtn, { backgroundColor: '#333' }]}>
                  <Text style={styles.editBtnText}>Share Profile</Text>
                </TouchableOpacity>
              </View>

              {/* Story Highlights */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.highlightsContainer}>
                {['New', 'Zalene', 'Art', 'Vibes', 'Life'].map((item, i) => (
                  <TouchableOpacity key={i} onPress={() => triggerModal(`${item} Stories`)} style={styles.highlightItem}>
                    <View style={styles.highlightCircle}>
                      {item === 'New' ? <Ionicons name="add" size={30} color="white" /> : <View style={styles.innerHighlight} />}
                    </View>
                    <Text style={styles.highlightText}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Grid Tabs */}
              <View style={styles.gridTabs}>
                <MaterialCommunityIcons name="grid" size={24} color="white" />
                <MaterialCommunityIcons name="movie-outline" size={24} color="gray" />
                <MaterialCommunityIcons name="account-outline" size={24} color="gray" />
              </View>

              {/* Grid Section */}
              <View style={styles.gridContainer}>
                <FlatList
                  data={posts}
                  numColumns={3}
                  scrollEnabled={false}
                  renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => triggerModal('Post Detail', item)} style={styles.gridBox}>
                      <Image source={{ uri: item.image }} style={styles.postImg} />
                    </TouchableOpacity>
                  )}
                  keyExtractor={(item) => item.id.toString()}
                />
              </View>
            </Animated.View>
            <View style={{ height: 100 }} />
          </ScrollView>
        </View>
      </ImageBackground>

      {/* Dynamic Sub-Page Modal */}
      {activeModal && (
        <SubPage title={activeModal}>
          {selectedPost ? (
            <View>
              <Image source={{ uri: selectedPost.image }} style={styles.detailImage} />
              <Text style={styles.detailText}>{selectedPost.caption}</Text>
              <View style={styles.actionRow}>
                <Ionicons name="heart" size={28} color={THEME.lavender} />
                <Ionicons name="chatbubble-outline" size={24} color="white" style={{ marginLeft: 20 }} />
              </View>
            </View>
          ) : (
            <View>
              <Text style={styles.subPageInfoText}>Welcome to the {activeModal} section.</Text>
              <View style={styles.placeholderRow} />
              <Text style={styles.subPageInfoText}>Managing Zalene luxury brand details and profile configurations here.</Text>
            </View>
          )}
        </SubPage>
      )}

      {/* Edit Profile Modal */}
      <EditProfileModal />

      {/* Bottom Tab Bar */}
      <View style={styles.bottomNav}>
        <Octicons name="home" size={24} color="white" />
        <Ionicons name="search" size={24} color="white" />
        <MaterialCommunityIcons name="plus-box-outline" size={26} color="white" />
        <MaterialCommunityIcons name="movie-outline" size={24} color="white" />
        <View style={styles.navAvatarCircle} />
      </View>
    </View>
  );
}

registerRootComponent(ProfileScreen);

const styles = StyleSheet.create({
  mainWrapper: { flex: 1, backgroundColor: THEME.bgPurple },
  fullScreenBg: { flex: 1 },
  darkOverlay: { flex: 1, backgroundColor: 'rgba(18, 13, 29, 0.88)' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 15 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  headerUsername: { fontSize: 20, fontWeight: 'bold', color: 'white' },
  centeredProfile: { alignItems: 'center', marginTop: 10 },
  profilePicWrapper: {
    borderRadius: 60,
    borderWidth: 3,
    borderColor: THEME.lavender,
    elevation: 20,
    shadowColor: THEME.lavender,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    position: 'relative'
  },
  profilePic: { width: 95, height: 95, borderRadius: 50 },
  verifiedBadge: { position: 'absolute', bottom: 5, right: 5, backgroundColor: 'white', borderRadius: 12 },
  fullName: { fontWeight: 'bold', marginTop: 12, fontSize: 20, color: 'white' },
  bioText: { color: '#BBB', fontSize: 13, textAlign: 'center', marginTop: 5, paddingHorizontal: 45 },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 5, gap: 4 },
  locationText: { color: '#999', fontSize: 12 },
  statsContainer: { flexDirection: 'row', justifyContent: 'center', gap: 40, marginTop: 20, padding: 10 },
  statNum: { fontWeight: 'bold', fontSize: 18, color: 'white', textAlign: 'center' },
  statLabel: { fontSize: 12, color: '#999' },
  buttonRow: { flexDirection: 'row', paddingHorizontal: 20, gap: 10, marginTop: 20 },
  editBtn: { flex: 1, borderRadius: 8, padding: 10, alignItems: 'center' },
  editBtnText: { fontWeight: 'bold', color: 'white', fontSize: 14 },
  highlightsContainer: { marginTop: 25, paddingLeft: 20 },
  highlightItem: { alignItems: 'center', marginRight: 20 },
  highlightCircle: { width: 64, height: 64, borderRadius: 32, borderWidth: 1, borderColor: '#444', alignItems: 'center', justifyContent: 'center', marginBottom: 5 },
  innerHighlight: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#222' },
  highlightText: { color: 'white', fontSize: 12 },
  gridTabs: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 30, paddingVertical: 10, borderTopWidth: 0.5, borderTopColor: '#333' },
  gridContainer: { paddingHorizontal: 1, marginTop: 5 },
  gridBox: {
    width: (width / 3) - 8,
    height: (width / 3) - 8,
    margin: 4,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: THEME.lavender,
    elevation: 10,
    shadowColor: THEME.lavender,
    shadowOpacity: 0.5,
    shadowRadius: 10,
    overflow: 'hidden'
  },
  postImg: { width: '100%', height: '100%' },
  bottomNav: { position: 'absolute', bottom: 0, width: width, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingVertical: 15, backgroundColor: '#120D1D', borderTopWidth: 0.5, borderTopColor: '#333' },
  navAvatarCircle: { width: 24, height: 24, borderRadius: 12, borderWidth: 1, borderColor: 'white', backgroundColor: '#555' },

  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', alignItems: 'center' },
  subPageContainer: { width: width * 0.9, height: height * 0.7, backgroundColor: THEME.bgPurple, borderRadius: 30, overflow: 'hidden', borderWidth: 1, borderColor: THEME.lavender },
  editContainer: { width: width * 0.9, height: height * 0.8, backgroundColor: THEME.bgPurple, borderRadius: 30, overflow: 'hidden', borderWidth: 1, borderColor: THEME.lavender },
  subPageBg: { flex: 1 },
  subPageHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 25, borderBottomWidth: 0.5, borderBottomColor: '#333' },
  subPageTitle: { color: 'white', fontSize: 22, fontWeight: 'bold' },
  subPageInfoText: { color: '#CCC', fontSize: 16, textAlign: 'center', marginTop: 20, lineHeight: 24 },
  placeholderRow: { height: 1, backgroundColor: THEME.lavender, marginVertical: 30, opacity: 0.3 },
  detailImage: { width: '100%', height: 300, borderRadius: 20, marginBottom: 20 },
  detailText: { color: 'white', fontSize: 16, lineHeight: 24 },
  actionRow: { flexDirection: 'row', marginTop: 20 },

  // Edit Profile Styles
  inputLabel: { color: 'white', fontSize: 14, marginBottom: 8, marginTop: 15 },
  input: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: 12, color: 'white', fontSize: 16, borderWidth: 1, borderColor: '#333' },
  textArea: { height: 80, textAlignVertical: 'top' },
  saveBtn: { backgroundColor: THEME.lavender, padding: 15, borderRadius: 12, marginTop: 30, alignItems: 'center' },
  saveBtnText: { color: THEME.bgPurple, fontWeight: 'bold', fontSize: 16 }
});