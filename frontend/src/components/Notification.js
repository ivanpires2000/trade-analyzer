// frontend/src/components/Notification.js
import React, { useState, useEffect } from 'react';

const Notification = ({ message }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setVisible(false), 5000);
        return () => clearTimeout(timer);
    }, []);

    if (!visible) return null;

    return (
        <div className="notification">
            {message}
        </div>
    );
};

export default Notification;