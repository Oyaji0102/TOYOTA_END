// context/LobbyContext.js
import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { AuthContext } from './AuthContext';
import { sendLocalNotification } from '../components/notifications';

export const LobbyContext = createContext();

export const LobbyProvider = ({ children }) => {
  const { user } = useContext(AuthContext);

  const [lobbyModalVisible, setLobbyModalVisible] = useState(false);
  const [lobbyType, setLobbyType] = useState('normal');
  const [eventStartDate, setEventStartDate] = useState(new Date());
  const [eventEndDate, setEventEndDate] = useState(new Date());
  const [isPrivate, setIsPrivate] = useState(false);
  const [lobbyPassword, setLobbyPassword] = useState('');
  const [skipGameSelection, setSkipGameSelection] = useState(false);
  const [lobbies, setLobbies] = useState([]);
  const [joinedLobby, setJoinedLobby] = useState(null);
  const [lobbyJoinedModalVisible, setLobbyJoinedModalVisible] = useState(false);
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [pendingLobbyData, setPendingLobbyData] = useState(null);
  const [pendingLobbyId, setPendingLobbyId] = useState(null);
  const pingIntervalRef = useRef(null);

  const openLobbyModal = () => {
    setSkipGameSelection(false); // her yeni açılışta sıfırla
    setLobbyModalVisible(true);
  };

  const closeLobbyModal = () => {
    setLobbyModalVisible(false);
  };

  const connectToLobby = (lobbyId, password = null) => {
    if (!user || !lobbyId) return;
    if (socket) {
      socket.close();
      setSocket(null);
    }

    const url = `ws://192.168.117.136:4000/lobby/${lobbyId}`;
    const ws = new WebSocket(url);

    ws.onopen = () => {
      setConnected(true);
      if (pendingLobbyData && pendingLobbyData.type === 'createLobby') {
        ws.send(JSON.stringify(pendingLobbyData));
        setPendingLobbyData(null);
      } else {
        ws.send(JSON.stringify({
          type: 'join',
          user: { id: user.id, email: user.email },
          lobbyId,
          password: password || null
        }));
      }
      setPendingLobbyId(null);
    };

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.type === 'error') return alert(data.message);
      if (data.type === 'lobbyCreated') {
        setLobbies(prev => [...prev, data.lobby]);
        setJoinedLobby(data.lobby);
        setLobbyJoinedModalVisible(true);
      }
      if (data.type === 'lobbyJoinConfirmed') {
        setJoinedLobby(data.lobby);
        setLobbyJoinedModalVisible(true);
      }
      if (data.type === 'allLobbies') setLobbies(data.lobbies);
      if (data.message) setMessages(prev => [...prev, data.message]);
    };

    ws.onerror = (e) => console.error('WebSocket error:', e.message);
    ws.onclose = () => setConnected(false);
    setSocket(ws);
  };

  useEffect(() => {
    if (connected && socket && user) {
      pingIntervalRef.current = setInterval(() => {
        if (socket.readyState === 1) {
          socket.send(JSON.stringify({
            type: 'ping',
            user: { id: user.id, email: user.email },
          }));
        }
      }, 30000);
    }
    return () => clearInterval(pingIntervalRef.current);
  }, [connected, socket]);

  const disconnectFromLobby = () => {
    if (socket) {
      socket.close();
      setSocket(null);
      setConnected(false);
      setMessages([]);
    }
    setJoinedLobby(null);
  };

  const handleLobbyNext = (selectedGame, skipGameSelection) => {
    const lobbyId = `lobby_${Date.now()}`;
  
    const lobbyData = {
      type: 'createLobby',
      user: { id: user.id, email: user.email },
      lobbyType,
      isPrivate,
      password: isPrivate ? lobbyPassword : null,
      eventStartDate: lobbyType === 'event' ? eventStartDate : null,
      eventEndDate: lobbyType === 'event' ? eventEndDate : null,
      gameId: selectedGame?.id || null,
      lobbyId,
    };
  
    if (socket) {
      socket.close();
      setSocket(null);
    }
  
    setPendingLobbyData(lobbyData);
    setPendingLobbyId(lobbyId);
    connectToLobby(lobbyId);
  
    closeLobbyModal();
  };
  
  const deleteLobby = (lobbyId) => {
    if (!socket || socket.readyState !== 1 || !user) return;
    socket.send(JSON.stringify({
      type: 'deleteLobby',
      user: { id: user.id, email: user.email },
      lobbyId,
    }));
  };

  return (
    <LobbyContext.Provider
      value={{
        lobbyModalVisible,
        lobbyType,
        eventStartDate,
        eventEndDate,
        setLobbyModalVisible,
        setLobbyType,
        setEventStartDate,
        setEventEndDate,
        openLobbyModal,
        closeLobbyModal,
        handleLobbyNext,
        socket,
        connected,
        messages,
        connectToLobby,
        disconnectFromLobby,
        isPrivate,
        setIsPrivate,
        lobbyPassword,
        setLobbyPassword,
        skipGameSelection,
        setSkipGameSelection,
        lobbies,
        setLobbies,
        joinedLobby,
        setJoinedLobby,
        lobbyJoinedModalVisible,
        setLobbyJoinedModalVisible,
        deleteLobby,
      }}
    >
      {children}
    </LobbyContext.Provider>
  );
};
