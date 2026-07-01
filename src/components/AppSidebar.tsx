import { NavLink, useLocation } from 'react-router-dom';
import {
  Home,
  Search,
  Music,
  Trophy,
  Download,
  ListMusic,
  User,
  Settings,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { usePlayer } from '@/context/PlayerContext';

const NAV_ITEMS = [
  { path: '/', label: '发现', icon: Home },
  { path: '/search', label: '搜索', icon: Search },
  { path: '/my-music', label: '我的音乐', icon: Music },
  { path: '/rank', label: '排行榜', icon: Trophy },
  { path: '/download', label: '下载管理', icon: Download },
  { path: '/queue', label: '播放队列', icon: ListMusic },
  { path: '/profile', label: '个人中心', icon: User },
  { path: '/settings', label: '设置', icon: Settings },
];

export default function AppSidebar() {
  const { pathname } = useLocation();
  const { user } = usePlayer();

  return (
    <Sidebar collapsible="icon" className="border-r border-border/50">
      <SidebarHeader className="px-3 py-4">
        <div className="flex items-center gap-3 group-data-[state=collapsed]:justify-center group-data-[state=collapsed]:px-0">
          <div className="size-9 shrink-0 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">H</span>
          </div>
          <div className="flex-1 min-w-0 group-data-[state=collapsed]:hidden">
            <div className="text-base font-semibold text-foreground">
              Harmony <span className="text-secondary">Music</span>
            </div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className="p-2">
          <SidebarMenu>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.path === '/'
                  ? pathname === '/'
                  : pathname === item.path || pathname.startsWith(`${item.path}/`);
              return (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild tooltip={item.label} isActive={isActive}>
                    <NavLink
                      to={item.path}
                      end={item.path === '/'}
                      className="flex items-center gap-3 relative"
                    >
                      {isActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-gradient-to-b from-primary to-secondary" />
                      )}
                      <Icon className="size-4 shrink-0" />
                      <span className="group-data-[state=collapsed]:hidden">{item.label}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3">
        <div className="flex items-center gap-3 group-data-[state=collapsed]:justify-center group-data-[state=collapsed]:px-0">
          <Avatar className="size-8 shrink-0">
            <AvatarImage src={user?.avatar} alt={user?.username} />
            <AvatarFallback className="bg-primary/20 text-primary text-xs">
              {user?.username?.[0] ?? 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0 group-data-[state=collapsed]:hidden">
            <div className="text-sm font-medium text-foreground truncate">
              {user?.username}
            </div>
            <div className="text-xs text-muted-foreground truncate">
              Lv.{user?.level}
            </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
