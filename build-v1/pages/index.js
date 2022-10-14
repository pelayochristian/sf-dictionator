import { useState } from 'react';
import Layout from '../components/layout/Layout';
import SObjectDuelPicklist from '../components/SObjectDuelPicklist';
import SObjectTable from '../components/SObjectTable';

export default function Home() {
    const [sObjectsWithDetails, setSObjectWithDetails] = useState([]);
    return (
        <Layout>
            <SObjectDuelPicklist
                setSObjectsWithDetails={setSObjectWithDetails}
            />
            <SObjectTable sObjectsWithDetails={sObjectsWithDetails} />
        </Layout>
    );
}
