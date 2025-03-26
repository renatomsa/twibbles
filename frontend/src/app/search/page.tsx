'use client';

import { apiService } from '@/lib/api';
import { User } from '@/types/user';
import { Search, MapPin, Hash, Users, X } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Post as PostType, postService } from '@/services/postService';
import Post from '@/components/feed/post';

export default function SearchPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchType, setSearchType] = useState<'users' | 'location' | 'hashtag'>('users');
    const [users, setUsers] = useState<User[]>([]);
    const [posts, setPosts] = useState<PostType[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<number>(709); // Default user ID

    // Get current user ID from localStorage when component mounts
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedUserId = localStorage.getItem('userId');
            if (storedUserId) {
                setCurrentUserId(parseInt(storedUserId, 10));
            } else {
                localStorage.setItem('userId', '709');
            }
        }
    }, []);

    // Debounced search function
    const debouncedSearch = useCallback(
        // Use a timeout to wait for user to stop typing
        (() => {
            let timer: NodeJS.Timeout;
            return (value: string) => {
                clearTimeout(timer);
                timer = setTimeout(() => {
                    if (value.trim().length >= 2) {
                        handleSearch(value);
                    }
                }, 500);
            };
        })(),
        [searchType]
    );

    // Update search when type changes
    useEffect(() => {
        if (searchTerm.trim().length >= 2) {
            handleSearch(searchTerm);
        }
    }, [searchType]);

    // Debounce search term changes
    useEffect(() => {
        if (searchTerm.trim().length >= 2) {
            debouncedSearch(searchTerm);
        } else if (searchTerm === '' && hasSearched) {
            // Clear results when search term is cleared
            setUsers([]);
            setPosts([]);
            setHasSearched(false);
        }
    }, [searchTerm, debouncedSearch]);

    const handleSearch = async (term: string = searchTerm) => {
        if (!term.trim() || term.trim().length < 2) return;

        try {
            setIsSearching(true);
            setHasSearched(true);

            if (searchType === 'users') {
                const response = await apiService.get<User[]>(`/user/get_users_by_substring/${term}`);

                if (response && response.status_code === 200 && response.data) {
                    console.log('Users search response:', response.data);
                    setUsers(response.data);
                    setPosts([]);
                } else {
                    setUsers([]);
                }
            } else if (searchType === 'location') {
                try {
                    console.log(`Searching for location: ${term}`);
                    const posts = await postService.getPostsByLocation(term);
                    console.log('Location search results:', posts);

                    if (posts && posts.length > 0) {
                        setPosts(posts);
                        setUsers([]);
                    } else {
                        console.log('No posts found for location:', term);
                        setPosts([]);
                        setUsers([]);
                    }
                } catch (error) {
                    console.error('Error searching by location:', error);
                    setPosts([]);
                }
            } else if (searchType === 'hashtag') {
                try {
                    console.log(`Searching for hashtag: ${term}`);
                    const posts = await postService.getPostsByHashtag(term);
                    console.log('Hashtag search results:', posts);

                    if (posts && posts.length > 0) {
                        setPosts(posts);
                        setUsers([]);
                    } else {
                        console.log('No posts found for hashtag:', term);
                        setPosts([]);
                        setUsers([]);
                    }
                } catch (error) {
                    console.error('Error searching by hashtag:', error);
                    setPosts([]);
                }
            }
        } catch (error) {
            console.error('Error searching:', error);
            setUsers([]);
            setPosts([]);
        } finally {
            setIsSearching(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearch();
        }
    };

    const clearSearch = () => {
        setSearchTerm('');
        setUsers([]);
        setPosts([]);
        setHasSearched(false);
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-100 pt-16">
            <main className="flex-1 max-w-2xl mx-auto w-full py-4 px-4">
                <h1 className="text-2xl font-bold mb-6 text-gray-800">Search</h1>

                {/* Search Type Selector */}
                <div className="flex mb-4 space-x-2 overflow-x-auto pb-1">
                    <button
                        onClick={() => setSearchType('users')}
                        className={`flex items-center px-4 py-2 rounded-md ${searchType === 'users'
                            ? 'bg-cyan-900 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                            } transition-colors`}
                    >
                        <Users size={18} className="mr-2" />
                        Users
                    </button>
                    <button
                        onClick={() => setSearchType('location')}
                        className={`flex items-center px-4 py-2 rounded-md ${searchType === 'location'
                            ? 'bg-cyan-900 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                            } transition-colors`}
                    >
                        <MapPin size={18} className="mr-2" />
                        Location
                    </button>
                    <button
                        onClick={() => setSearchType('hashtag')}
                        className={`flex items-center px-4 py-2 rounded-md ${searchType === 'hashtag'
                            ? 'bg-cyan-900 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                            } transition-colors`}
                    >
                        <Hash size={18} className="mr-2" />
                        Hashtag
                    </button>
                </div>

                {/* Search Box */}
                <div className="bg-white p-4 rounded-md shadow-sm mb-6">
                    <div className="flex items-center space-x-2">
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder={
                                    searchType === 'users'
                                        ? "Search for users..."
                                        : searchType === 'location'
                                            ? "Search by location..."
                                            : "Search by hashtag..."
                                }
                                className="w-full px-4 py-2 rounded-md bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 pr-10"
                            />
                            {searchTerm && (
                                <button
                                    onClick={clearSearch}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>
                        <button
                            onClick={() => handleSearch()}
                            className="p-2 bg-cyan-900 rounded-md hover:bg-cyan-800 transition-colors"
                        >
                            <Search size={24} className="text-white" />
                        </button>
                    </div>
                    {searchTerm && searchTerm.length < 2 && (
                        <p className="text-xs text-gray-500 mt-1 ml-1">Type at least 2 characters to search</p>
                    )}
                </div>

                {/* Results */}
                <div className="space-y-4">
                    {isSearching ? (
                        <div className="flex justify-center py-8">
                            <p className="text-gray-500">Searching...</p>
                        </div>
                    ) : searchType === 'users' && users.length > 0 ? (
                        users.map((user) => (
                            <Link
                                key={user.id}
                                href={`/profile/${user.id}`}
                                className="flex items-center space-x-4 p-4 bg-white rounded-md shadow-sm cursor-pointer hover:bg-gray-50 transition-colors"
                            >
                                <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                                    {user.profile_img_path ? (
                                        <img
                                            src={user.profile_img_path}
                                            alt={`${user.user_name}'s profile`}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-lg font-bold text-gray-600">
                                            {user.user_name?.charAt(0).toUpperCase() || 'U'}
                                        </span>
                                    )}
                                </div>
                                <span className="text-gray-800 font-medium">
                                    {user.user_name}
                                </span>
                            </Link>
                        ))
                    ) : searchType !== 'users' && posts.length > 0 ? (
                        posts.map((post) => (
                            <div key={post.id} className="mb-4">
                                <Post
                                    post_id={post.id}
                                    user_id={post.user_id}
                                    user_name={post.user_name || `User #${post.user_id}`}
                                    post_text={post.text}
                                    currentUserId={currentUserId}
                                    location={post.location}
                                    hashtags={post.hashtags}
                                    profile_img_path={post.profile_img_path}
                                    onDelete={(postId) => {
                                        // Remove the deleted post from the list
                                        setPosts(prev => prev.filter(p => p.id !== postId));
                                    }}
                                />
                            </div>
                        ))
                    ) : searchTerm && searchTerm.length >= 2 && hasSearched && !isSearching ? (
                        <div className="flex justify-center py-8">
                            <p className="text-gray-500">
                                {searchType === 'users'
                                    ? "No users found"
                                    : searchType === 'location'
                                        ? "No posts found at this location"
                                        : "No posts found with this hashtag"
                                }
                            </p>
                        </div>
                    ) : !searchTerm && (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                            <div className="text-gray-400 mb-2">
                                {searchType === 'users' ? (
                                    <Users size={48} />
                                ) : searchType === 'location' ? (
                                    <MapPin size={48} />
                                ) : (
                                    <Hash size={48} />
                                )}
                            </div>
                            <p className="text-gray-500">
                                {searchType === 'users'
                                    ? "Search for users by name"
                                    : searchType === 'location'
                                        ? "Search for posts by location"
                                        : "Search for posts by hashtag"
                                }
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
