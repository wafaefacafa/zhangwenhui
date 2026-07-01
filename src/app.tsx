import { Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import NotFoundPage from "@/pages/NotFoundPage/NotFoundPage";
import SplashPage from "@/pages/SplashPage/SplashPage";
import LoginPage from "@/pages/LoginPage/LoginPage";
import HomePage from "@/pages/HomePage/HomePage";
import SearchPage from "@/pages/SearchPage/SearchPage";
import MyMusicPage from "@/pages/MyMusicPage/MyMusicPage";
import RankPage from "@/pages/RankPage/RankPage";
import PlayerPage from "@/pages/PlayerPage/PlayerPage";
import PlaylistDetailPage from "@/pages/PlaylistDetailPage/PlaylistDetailPage";
import ArtistPage from "@/pages/ArtistPage/ArtistPage";
import AlbumPage from "@/pages/AlbumPage/AlbumPage";
import LyricsPage from "@/pages/LyricsPage/LyricsPage";
import ProfilePage from "@/pages/ProfilePage/ProfilePage";
import SettingsPage from "@/pages/SettingsPage/SettingsPage";
import DownloadPage from "@/pages/DownloadPage/DownloadPage";
import QueuePage from "@/pages/QueuePage/QueuePage";
import { PlayerProvider } from "@/context/PlayerContext";

export default function App() {
  return (
    <PlayerProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="splash" element={<SplashPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="my-music" element={<MyMusicPage />} />
          <Route path="rank" element={<RankPage />} />
          <Route path="player" element={<PlayerPage />} />
          <Route path="playlist/:id" element={<PlaylistDetailPage />} />
          <Route path="artist/:id" element={<ArtistPage />} />
          <Route path="album/:id" element={<AlbumPage />} />
          <Route path="lyrics" element={<LyricsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="download" element={<DownloadPage />} />
          <Route path="queue" element={<QueuePage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </PlayerProvider>
  );
}
