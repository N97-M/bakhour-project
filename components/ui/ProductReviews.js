'use client';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/utils/supabase';
import { useLanguage } from '@/context/LanguageContext';
import { Star, Image as ImageIcon, CheckCircle, Filter, Trash2 } from 'lucide-react';
import { translations } from '@/utils/translations';
import styles from './ProductReviews.module.css';

export default function ProductReviews({ productId }) {
    const { lang } = useLanguage();
    const t = translations[lang].reviews;
    const [reviews, setReviews] = useState([]);
    const [filter, setFilter] = useState('all'); // 'all', '5-star', 'with-photos'
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Form State
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [files, setFiles] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState('');

    const fetchReviewsAndUser = useCallback(async () => {
        setLoading(true);
        const { data: { user: userData } } = await supabase.auth.getUser();
        setUser(userData);

        // Mock data for display purposes
        const mockReviews = [
            {
                review_id: 'mock-1',
                rating: 5,
                comment: 'Very good quality and fast delivery. The scent is extremely authentic to our heritage!',
                user_name: 'Ahmed K.',
                review_date: new Date().toISOString(),
                image_urls: ['/images/packaging-1.jpg'],
                is_verified_purchase: true
            }
        ];

        // Fetch actual reviews from Supabase
        const { data: dbReviews, error } = await supabase
            .from('reviews')
            .select('review_id, rating, comment, review_date, image_urls, is_verified_purchase, user_name, user_id')
            .eq('product_id', productId)
            .order('review_date', { ascending: false });

        if (error) {
            console.error('Error fetching reviews:', error);
            setReviews(mockReviews);
            setLoading(false);
            return;
        }

        if (dbReviews && dbReviews.length > 0) {
            const formattedReviews = dbReviews.map(r => ({
                ...r,
                user_name: r.user_name || t.defaultUser
            }));
            setReviews([...formattedReviews, ...mockReviews]);
        } else {
            setReviews(mockReviews);
        }
        setLoading(false);
    }, [productId, t.defaultUser]);

    useEffect(() => {
        fetchReviewsAndUser();
    }, [fetchReviewsAndUser]);

    const handlePhotoUpload = async (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles(selectedFiles);
    };

    const submitReview = async (e) => {
        e.preventDefault();
        if (!user) return alert(t.form.errorAuth);
        setSubmitting(true);

        const uploadedUrls = [];

        // Upload images to Supabase Storage
        for (const file of files) {
            const fileName = `${Date.now()}-${file.name}`;
            const { data, error } = await supabase.storage
                .from('review_images')
                .upload(fileName, file);

            if (data) {
                const { data: publicUrlData } = supabase.storage.from('review_images').getPublicUrl(fileName);
                uploadedUrls.push(publicUrlData.publicUrl);
            }
        }

        // Insert Review to Database
        const { error } = await supabase.from('reviews').insert({
            product_id: productId,
            user_id: user.id,
            user_name: user.user_metadata?.full_name || t.defaultUser,
            rating,
            comment,
            image_urls: uploadedUrls,
            is_verified_purchase: true // In reality, verify order history first
        });

        if (!error) {
            setSubmitSuccess(t.form.successMsg);
            setComment('');
            setRating(5);
            setFiles([]);
            fetchReviewsAndUser(); // Refresh the list immediately
        } else {
            alert(t.form.errorSubmit + error.message);
        }
        setSubmitting(false);
    };

    const handleDeleteReview = async (reviewId) => {
        if (!window.confirm(t.item.deleteConfirm)) return;

        const { error } = await supabase
            .from('reviews')
            .delete()
            .eq('review_id', reviewId);

        if (error) {
            alert(t.item.errorDelete + error.message);
        } else {
            fetchReviewsAndUser();
        }
    };

    const renderStars = (ratingValue) => {
        return [...Array(5)].map((_, i) => (
            <Star
                key={i}
                size={16}
                fill={i < ratingValue ? '#C6A75E' : 'transparent'}
                color={i < ratingValue ? '#C6A75E' : '#555'}
            />
        ));
    };

    const averageRating = reviews.length > 0
        ? (reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length).toFixed(1)
        : 0;

    const filteredReviews = reviews.filter(r => {
        if (filter === '5-star') return r.rating === 5;
        if (filter === 'with-photos') return r.image_urls && r.image_urls.length > 0;
        return true;
    });

    const allPhotos = reviews.flatMap(r => r.image_urls || []);
    const isAdmin = user?.email === 'aldalalbakhour@gmail.com' || user?.email === 'monzerhafiz83@gmail.com';

    return (
        <section className={styles.reviewsSection}>
            <div className="container">
                <div className={styles.header}>
                    <h2 className={styles.title}>
                        {t.title}
                    </h2>
                    <span className="gold-divider" />
                </div>

                <div className={styles.reviewsGrid}>
                    {/* Left Column: Summary & Filters & Form */}
                    <div className={styles.sidebar}>
                        <div className={styles.summaryCard}>
                            <div className={styles.avgScore}>{averageRating}</div>
                            <div className={styles.avgStars}>{renderStars(Math.round(averageRating))}</div>
                            <p className={styles.totalCount}>{t.basedOn} {reviews.length} {t.reviewsCount}</p>
                        </div>

                        <div className={styles.filters}>
                            <button className={`${styles.filterBtn} ${filter === 'all' ? styles.active : ''}`} onClick={() => setFilter('all')}>
                                {t.filters.all}
                            </button>
                            <button className={`${styles.filterBtn} ${filter === '5-star' ? styles.active : ''}`} onClick={() => setFilter('5-star')}>
                                {t.filters.stars5}
                            </button>
                            <button className={`${styles.filterBtn} ${filter === 'with-photos' ? styles.active : ''}`} onClick={() => setFilter('with-photos')}>
                                {t.filters.withPhotos}
                            </button>
                        </div>

                        {/* Submission Form */}
                        {user ? (
                            <div className={styles.submitCard}>
                                <h3>{t.form.title}</h3>
                                {submitSuccess && <p className={styles.success}>{submitSuccess}</p>}
                                <form onSubmit={submitReview} className={styles.form}>
                                    <div className={styles.ratingSelect}>
                                        <p>{t.form.tapStar}</p>
                                        <div className={styles.interactiveStars}>
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <Star
                                                    key={star}
                                                    size={24}
                                                    cursor="pointer"
                                                    fill={star <= rating ? '#C6A75E' : 'transparent'}
                                                    color={star <= rating ? '#C6A75E' : '#555'}
                                                    onClick={() => setRating(star)}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    <textarea
                                        placeholder={t.form.placeholder}
                                        className={styles.textarea}
                                        value={comment}
                                        onChange={e => setComment(e.target.value)}
                                        required
                                    />

                                    <div className={styles.fileUpload}>
                                        <label htmlFor="photos" className={styles.uploadLabel}>
                                            <ImageIcon size={20} /> {t.form.addPhotos} {files.length > 0 && `(${files.length})`}
                                        </label>
                                        <input
                                            type="file"
                                            id="photos"
                                            multiple
                                            accept="image/*"
                                            style={{ display: 'none' }}
                                            onChange={handlePhotoUpload}
                                        />
                                    </div>

                                    <button type="submit" className={`btn-luxury w-100 ${styles.submitBtn}`} disabled={submitting}>
                                        {submitting ? t.form.submitting : t.form.submit}
                                    </button>
                                </form>
                            </div>
                        ) : (
                            <div className={styles.loginPrompt}>
                                <p>{t.form.loginPrompt}</p>
                                <a href="/login" className="btn-luxury">{t.form.loginBtn}</a>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Review List & Photo Gallery */}
                    <div className={styles.mainContent}>

                        <div className={styles.reviewList}>
                            {filteredReviews.length === 0 ? (
                                <p>{t.empty}</p>
                            ) : (
                                filteredReviews.map(r => (
                                    <div key={r.review_id} className={styles.reviewItem}>
                                        <div className={styles.reviewHeader}>
                                            <div className={styles.reviewerInfo}>
                                                <strong>{r.user_name}</strong>
                                                {r.is_verified_purchase && (
                                                    <span className={styles.verified}>
                                                        <CheckCircle size={12} /> {t.item.verified}
                                                    </span>
                                                )}
                                            </div>
                                            <span className={styles.date}>
                                                {new Date(r.review_date).toLocaleDateString(lang === 'en' ? 'en-US' : 'ar-AE', { month: 'long', year: 'numeric' })}
                                            </span>
                                            {(isAdmin || (user && r.user_id === user.id)) && (
                                                <button
                                                    className={styles.deleteBtn}
                                                    onClick={() => handleDeleteReview(r.review_id)}
                                                    title="Delete Review"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            )}
                                        </div>
                                        <div className={styles.reviewStars}>
                                            {renderStars(r.rating)}
                                        </div>
                                        <p className={styles.reviewComment}>{r.comment}</p>

                                        {r.image_urls && r.image_urls.length > 0 && (
                                            <div className={styles.reviewPhotos}>
                                                {r.image_urls.map((url, i) => (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img key={i} src={url} alt="Review attachment" className={styles.attachedImg} />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
