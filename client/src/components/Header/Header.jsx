import React,{useRef,useEffect,useState} from 'react';
import {Link, NavLink,useNavigate} from 'react-router-dom'
import './Header.css'
import logo from "../../assets/images/eco-logo.png";
import user_icon from "../../assets/images/user-icon.png"
import {Container,Row}from "reactstrap";
import{motion} from "framer-motion";
import {useSelector,useDispatch} from"react-redux";
import {  selectCurrentUser } from '../../redux/slices/userSlice';
import { Logout } from '../../redux/apiCall';
import {cartActions} from "../../redux/slices/cartSlice";
import {behaviorActions} from "../../redux/slices/behaviorSlice";
import Dropdown from '../Dropdown/Dropdown.jsx';

const nav__link=[
  {
    path:"home",
    display:"Home"
  },
  {
    path:"shop",
    display:"Shop"
  },
  {
    path:"cart",
    display:"Cart"
  }
]

const Header = () => {

  const headerRef=useRef(null);
  const menuRef=useRef(null);
  const navigate=useNavigate();
  const currentUser=useSelector(selectCurrentUser);
  const profileActions=useRef(null);
  const dispatch=useDispatch();
  const [isShowDrop,setIsShowDrop]=useState(false);
  

  const handleLogout=()=>{
    Logout(dispatch);
    dispatch(cartActions.resetCart());
    dispatch(behaviorActions.resetBehavior());
    navigate("/home");
  }

  const totalQuantity=useSelector(state=>state.cart.totalQuantity)

  const stickyHeaderFunc=()=>{
    window.addEventListener('scroll',()=>{
      if(document.body.scrollTop>80|| document.documentElement.scrollTop>80){
        headerRef.current.classList.add('sticky__header');
      }else{
        headerRef.current.classList.remove('sticky__header')

      }
    })
  }

  const navigateToCart=()=>{
    navigate("/cart")
  }

  useEffect(()=>{
    stickyHeaderFunc();
    return ()=> window.removeEventListener('scroll', stickyHeaderFunc)
  });

  const profileActionsToggle=()=>profileActions.current.classList.toggle('show__profileActions')

  const menuToggle=()=> menuRef.current.classList.toggle('active__menu')

  return (
    <header className="header" ref={headerRef}>
      <Container>
        <Row>
          <div className="nav__wrapper">
            <div className="logo">
              <img src={logo} alt="logo" />
              <div className="">
                <h1>MultiMart</h1>
              </div>
            </div>

            <div className="navigation" ref={menuRef} onClick={menuToggle}>
              <ul className="menu">
                {
                  nav__link.map((item,index)=>
                    (
                      index===1?
                        <li className="nav__item" onMouseEnter={()=>setIsShowDrop(true)}  key={index}>
                          <NavLink to={item.path} className={(navClass)=>navClass.isActive?"nav__active":""} >
                            {item.display}
                          </NavLink>
                          <div className={isShowDrop?"div_show":"div_block"} onMouseLeave={()=>setIsShowDrop(false)}>
                              <Dropdown/>
                          </div>
                        </li>
                        :
                        <li className="nav__item"  key={index}>
                          <NavLink to={item.path} className={(navClass)=>navClass.isActive?"nav__active":""} >
                            {item.display}
                          </NavLink>
                        </li>
                    )
                  )
                }
              </ul>
            </div>
            
            <div className="nav__icons">
              <span className="cart__icon" onClick={navigateToCart}>
                <i class="ri-shopping-bag-line"></i>
                <span className="badge">{totalQuantity}</span>
              </span>
              
              <div className='profile'>
                <motion.img  
                  whileTap={{scale:1.4}} src={currentUser?.img ||user_icon} alt="avatar"
                  srcset="" 
                  onClick={profileActionsToggle}
                />
              
                <div className="profile__actions" ref={profileActions} onClick={profileActionsToggle} >
                  {
                    currentUser?
                    <div className=" d-flex align-items-center justify-content-center flex-column"> 
                      <span onClick={handleLogout}>Logout</span>
                      <Link to={`/profile`}> Profile</Link>
                    </div> 
                    :
                    <div className=" d-flex align-items-center justify-content-center flex-column"> 
                      <Link to='/login'> Login</Link>
                      <Link to='/signup'> Signup</Link>
                    </div>
                  }
                </div>
              </div>

              <div className="mobile__menu" onClick={menuToggle}>
              <span>
                <i class="ri-menu-line"></i>
              </span>
            </div>
            </div>
          </div>
        </Row>
      </Container>
    </header>
  )
}

export default Header