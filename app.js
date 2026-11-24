import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { 
  Menu, X, Search, Users, MessageSquare, Bell, Home, 
  MessageSquareMore, Phone, Video, LogOut, User, 
  Image as ImageIcon, Mic, Send, MoreHorizontal, Share
} from 'lucide-react';
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL = "https://tzkxujrjrhyqxgzytaex.supabase.co";
const SUPABASE_KEY = "sb_publishable_BrNnF8XCshRm1NmEYvQphg_hcNIJhQV";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ... [Компоненты UI здесь] ...

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [sessionUser, setSessionUser] = useState(null);

  // Авторизация
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSessionUser(session?.user);
      if(session?.user) setUser(session.user);
    });
    
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setSessionUser(session?.user);
      if(session?.user) setUser(session.user);
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSessionUser(null);
    setUser(null);
  };

  return (
    <div>
      {/* Скрытые связи с Supabase для контекста */}
      <supabase-context.Provider value={{user: sessionUser}}>
        
        <BrowserRouter>
          {/* Верхняя панель */}
          <header className="topbar">
            <div className="brand">
              apple-<span>BOOK</span>
            </div>
            {sessionUser ? (
              <div className="top-user">
                <img src={sessionUser.user_metadata?.avatar || "https://via.placeholder.com/40"} className="avatar-small" />
                <span>{sessionUser.email || "User"}</span>
              </div>
            ) : null}
            <button className="header-btn" onClick={() => setMobileMenu(true)}>
               <Menu size={24} />
            </button>
          </header>

          {/* Основное меню (Навигация) */}
          {sessionUser ? (
            <nav className="sidebar">
              <button className="close-btn" onClick={() => setMobileMenu(false)}><X size={20}/></button>
              <ul className="nav-list">
                <li><Link to={`/feed`} className={`nav-btn active`}><Home size={18}/><span>Лента</span></Link></li>
                <li><Link to={`/messages`} className={`nav-btn`}><MessageSquare size={18}/><span>Чаты</span></Link></li>
                <li><Link to={`/friends`} className={`nav-btn`}><Users size={18}/><span>Друзья</span></Link></li>
                <li><Link to={`/groups`} className={`nav-btn`}><Users2 size={18}/><span>Группы</span></Link></li>
                <li><Link to `/channels` className={`nav-btn`}><Megaphone size={18}/><span>Каналы</span></Link></li>
              </ul>
              <div className="sidebar-footer">
                <button className="nav-btn" onClick={handleLogout}><LogOut size={18} /> <span>Выйти</span></button>
                <div className="mini-profile">
                   <img src={sessionUser.user_metadata?.avatar || "https://via.placeholder.com/40"} className="avatar-small" />
                </div>
                <span className="online-status">● Онлайн</span>
              </div>
            </nav>
          ) : (
            <div id="loginPage">
               <div className="auth-card">
                 <div className="auth-brand" style={{marginBottom:"20px", color: "var(--wine)", fontWeight: "bold", fontSize: "32px"}}>Привет, гость</div>
                 <h3 className="title">Вход в Apple-BOOK</h3>
                 <p className="desc">Используйте свой email для входа</p>
                 <br/>
                 <input type="email" placeholder="Email" className="wide" id="emailInput"/>
                 <div className="tabs">
                    <button className="tab active">Личная</button>
                    <button className="tab">Партнёрский</button>
                 </div>
                 <button className="primary large-btn" onClick={handleLogin}><div className="log-btn-text">Войти</div></button>
                 <div className="guard" style={{textAlign:"center", marginTop:"20px", fontSize:"11px", color: "var(--line)"}}>Подписываясь на влевы, вы соглашаетесь с <a href="#">Пользовательским соглашением</a> и <a href="#">Политикой конфиденциальности</a></div>
               </div>
            </div>
          )}

          {/* Рендер контента */}
          {sessionUser && (
            <div className="shell">
              {/* Фильтр над контентом (Сверху) */}
              <div className="rightcol">
                 <div className="right-bar">
                    <div className="input-box"><input type="text" placeholder="Поиск в apple-BOOK..." className="search-input" /></div>
                    <div className="fav-filter">
                       <button className="primary small-type">Избранное</button>
                       <button className="secondary small-type">Новости</button>
                    </div>
                    <div className="create-post-btn">
                       <button className="btn-post">Создать</button>
                    </div>
                    <ul className="chat-items">
                        <li className="chat-contact active chat-contact-avatar"><img src="https://via.placeholder.com/30" /><div className="contact-name">Чат 1</div></li>
                        <li className="chat-contact"><img src="https://via.placeholder.com/30" /><div className="contact-name">Чат 2</div></li>
                    </ul>
                 </div>
              </div>

              {/* Layout */}
              <div className="layout">
                  <div className="leftcol">
                     <div className="panel">
                      <div className="header-bar" style={{background: "var(--wine)", color: "white", padding: "16px", borderRadius: "5px", marginBottom: "10px"}}>
                         <div className="header-left">
                           <h2 className="post-title">Лента</h2>
                         </div>
                      </div>
                      <div className="posts">
                        <div className="post">
                           <div className="post-header">
                              <div className="post-avatar"><User size={20}/></div>
                              <div className="post-info">
                                 <strong className="post-author">Пользователь 1</strong>
                                 <span className="post-date">Сегодня, 10:00</span>
                              </div>
                              <div className="post-actions">
                                <button><MoreHorizontal size={18}/></button>
                              </div>
                           </div>
                           <div className="post-body">
                              Привет! Как тебе дизайн?
                           </div>
                        </div>
                      </div>
                     </div>
                  
                  </div>
                  
                  <div className="rightcol"> 
                     <div className="created-panel">
                       <div className="post">
                          <div className="post-header">
                             <div className="post-avatar"><User size={20}/></div>
                             <div className="post-info">
                                <strong className="post-author">Моя страница</strong>
                                <span className="post-date">Сегодня, 09:30</span>
                             </div>
                             <div className="post-actions"><MoreHorizontal size={18}/></div>
                           </div>
                           <div className="post-body"> Texte de l'utilisateur... </div>
                       </div>
                     </div>
                  </div>
              </div>
              </div>
            )
          )}

        </BrowserRouter>
      </supabase-context.Provider>
    </div>
  );
};

export default App;
