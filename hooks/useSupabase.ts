
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Intersection, Alert, TrafficStats } from '../types';
import { MOCK_STATS, MOCK_INTERSECTION, MOCK_ALERTS } from '../constants'; // Fallback to mock data if connection fails

export const useIntersections = () => {
    const [intersections, setIntersections] = useState<Intersection[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchIntersections();

        // Optional: Realtime subscription
        const subscription = supabase
            .channel('intersections_changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'intersections' }, (payload) => {
                fetchIntersections(); // Refresh on change
            })
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const fetchIntersections = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('intersections')
                .select('*');

            if (error) throw error;

            if (data && data.length > 0) {
                // Map database fields to frontend types if necessary (snake_case to camelCase)
                const mappedData: Intersection[] = data.map(item => ({
                    id: item.id,
                    name: item.name,
                    status: item.status,
                    trafficFlow: item.traffic_flow,
                    avgSpeed: item.avg_speed,
                    congestionLevel: item.congestion_level,
                    signalPhase: item.signal_phase,
                    countDown: item.count_down
                }));
                setIntersections(mappedData);
            } else {
                // Fallback or empty
                setIntersections([MOCK_INTERSECTION]);
            }
        } catch (err: any) {
            console.error('Error fetching intersections:', err);
            setError(err.message);
            setIntersections([MOCK_INTERSECTION]); // Fallback
        } finally {
            setLoading(false);
        }
    };

    return { intersections, loading, error, refetch: fetchIntersections };
};

export const useAlerts = (statusFilter?: string, categoryFilter?: string) => {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAlerts();
    }, [statusFilter, categoryFilter]);

    const fetchAlerts = async () => {
        try {
            setLoading(true);
            let query = supabase.from('alerts').select('*');

            if (statusFilter && statusFilter !== 'all') {
                query = query.eq('status', statusFilter);
            }
            if (categoryFilter && categoryFilter !== 'all') {
                query = query.eq('type', categoryFilter);
            }

            const { data, error } = await query.order('created_at', { ascending: false });

            if (error) throw error;

            if (data) {
                setAlerts(data);
            }
        } catch (err: any) {
            console.error('Error fetching alerts:', err);
            // Fallback filtering on mock data
            let filtered = [...MOCK_ALERTS];
            if (statusFilter && statusFilter !== 'all') filtered = filtered.filter(a => a.status === statusFilter);
            if (categoryFilter && categoryFilter !== 'all') filtered = filtered.filter(a => a.type === categoryFilter);
            setAlerts(filtered);
        } finally {
            setLoading(false);
        }
    };

    return { alerts, loading, refetch: fetchAlerts };
};

export const useTrafficStats = () => {
    const [stats, setStats] = useState<TrafficStats>(MOCK_STATS);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);

            // Get total intersections
            const { count: totalIntersections, error: countError } = await supabase
                .from('intersections')
                .select('*', { count: 'exact', head: true });

            if (countError) throw countError;

            // Get online count
            const { count: onlineCount } = await supabase
                .from('intersections')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'online');

            // Get pending alerts
            const { count: pendingAlerts } = await supabase
                .from('alerts')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'pending');

            // Get emergency requests
            const { count: emergencyRequests } = await supabase
                .from('alerts')
                .select('*', { count: 'exact', head: true })
                .eq('type', 'emergency')
                .eq('status', 'pending'); // Assuming only pending emergencies count

            // Calculate mock congestion index/status for now as it's complex to aggregate from raw data without a backend function
            // In a real app, you might have a database function or another table for this.
            // We will reuse the mock logic or some simple calculation

            setStats({
                onlineRate: totalIntersections ? Math.round(((onlineCount || 0) / totalIntersections) * 100) : 0,
                onlineStatus: (onlineCount || 0) / (totalIntersections || 1) > 0.9 ? 'normal' : 'warning',
                congestionIndex: 65, // Placeholder/Calculated
                congestionStatus: '轻度拥堵', // Placeholder
                pendingAlerts: pendingAlerts || 0,
                emergencyRequests: emergencyRequests || 0,
                totalIntersections: totalIntersections || 0
            });

        } catch (err) {
            console.error("Error fetching stats:", err);
            setStats(MOCK_STATS);
        } finally {
            setLoading(false);
        }
    };

    return { stats, loading, refetch: fetchStats };
};
