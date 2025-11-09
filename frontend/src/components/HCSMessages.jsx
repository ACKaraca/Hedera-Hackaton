import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './HCSMessages.css';

const MIRROR_NODE_URL = 'https://testnet.mirrornode.hedera.com';
const TOPIC_ID = process.env.REACT_APP_HCS_TOPIC_ID || '0.0.123456'; // Default topic ID

// Base64 decode helper
const base64Decode = (str) => {
  try {
    return atob(str);
  } catch (e) {
    return str;
  }
};

export const HCSMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch messages from Mirror Node API
        const response = await axios.get(
          `${MIRROR_NODE_URL}/api/v1/topics/${TOPIC_ID}/messages`,
          {
            params: {
              limit: 50,
              order: 'desc'
            }
          }
        );

        const messagesData = response.data.messages || [];
        
        // Process and decode messages
        const processedMessages = messagesData.map((msg, index) => {
          let decodedMessage = '';
          try {
            if (msg.message) {
              decodedMessage = base64Decode(msg.message);
            }
          } catch (e) {
            decodedMessage = msg.message || 'Decode edilemedi';
          }

          return {
            id: msg.consensus_timestamp || `msg-${index}`,
            timestamp: msg.consensus_timestamp,
            message: decodedMessage,
            rawMessage: msg.message,
            sequenceNumber: msg.sequence_number,
            runningHash: msg.running_hash
          };
        });

        // Reverse to show newest first
        setMessages(processedMessages.reverse());
      } catch (err) {
        console.error('Error fetching HCS messages:', err);
        setError('HCS mesajları yüklenemedi. Topic ID\'yi kontrol edin.');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
    
    // Auto-refresh every 10 seconds
    const interval = setInterval(fetchMessages, 10000);
    return () => clearInterval(interval);
  }, []);

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Bilinmiyor';
    try {
      // Hedera timestamps are in nanoseconds, convert to milliseconds
      const timestampMs = parseInt(timestamp) / 1000000;
      return new Date(timestampMs).toLocaleString('tr-TR');
    } catch (e) {
      return timestamp;
    }
  };

  if (loading && messages.length === 0) {
    return (
      <div className="hcs-loading">
        <div className="spinner"></div>
        <p>HCS mesajları yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="hcs-messages">
      <div className="hcs-header">
        <h1>HCS Kanıt Akışı</h1>
        <p className="hcs-subtitle">
          Hedera Consensus Service üzerinden gelen gerçek zamanlı mesajlar
        </p>
        <p className="hcs-info">
          Topic ID: {TOPIC_ID} | Son güncelleme: Her 10 saniyede bir
        </p>
      </div>

      {error && (
        <div className="hcs-error">
          <p>{error}</p>
          <p className="error-hint">
            Lütfen REACT_APP_HCS_TOPIC_ID environment variable'ını kontrol edin.
          </p>
        </div>
      )}

      {messages.length > 0 ? (
        <div className="messages-list">
          {messages.map((msg) => (
            <div key={msg.id} className="message-card">
              <div className="message-header">
                <span className="message-sequence">#{msg.sequenceNumber || 'N/A'}</span>
                <span className="message-timestamp">
                  {formatTimestamp(msg.timestamp)}
                </span>
              </div>
              <div className="message-content">
                <pre className="message-text">{msg.message || 'Mesaj içeriği yok'}</pre>
              </div>
              {msg.runningHash && (
                <div className="message-footer">
                  <span className="message-hash">
                    Hash: {msg.runningHash.slice(0, 16)}...
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        !error && (
          <div className="no-messages">
            <p>Henüz mesaj bulunmuyor.</p>
          </div>
        )
      )}

      {loading && messages.length > 0 && (
        <div className="refreshing-indicator">
          <span>Yenileniyor...</span>
        </div>
      )}
    </div>
  );
};

