import React from 'react';
import { NotificationManager} from 'react-notifications';
import {motion} from "framer-motion"
import { Col } from 'reactstrap';
import {Link} from "react-router-dom";
import "./ProductCard.css";

import {useDispatch,useSelector} from "react-redux";
import { selectCurrentUser } from '../../../redux/slices/userSlice';
import {cartActions} from "../../../redux/slices/cartSlice";
import {behaviorActions} from "../../../redux/slices/behaviorSlice";
import { updateCart,addBehavior,checkBehaviorLink } from '../../../redux/apiCall';

const ProductCard = ({item}) => {

  const dispatch=useDispatch();
  const currentUser=useSelector(selectCurrentUser);
  const cart=useSelector(state=>state.cart.cartItems);
  const actionItems=useSelector(state=>state.behavior.actions);
  const addToCart= async()=>{
    let link;
    NotificationManager.success("",'Product added successfully', 2000);
    if(currentUser){
      const res=await checkBehaviorLink(currentUser.id,item._id,currentUser)
        if(res?.message){
          const linkBehavior=res.data.find(item=>item.link!=="");
          link=linkBehavior?.link;
        }
      updateCart(cart,currentUser,{
        "productId":item._id,
        "quantity":1,
        "price":item.price,
        "vendorId":item.userId,
        "imgUrl":item.img,
        "productName":item.title,
        "link":link||"",
      });
      addBehavior({
        "find":item._id,
        "date":new Date().getTime(),
        "status":"want"
      },currentUser);
      dispatch(cartActions.addItem({
        "item":{
        id:item._id,
        vendorId:item.userId,
        productName:item.title,
        price:item.price,
        imgUrl:item.img,
        "link":link||"",
        },
        qty:1
       }));
    }else{
      const exisItem=actionItems.find(item=>item.find===item._id);
      if(exisItem){
        link=exisItem.link;
      }
      dispatch(behaviorActions.addAction({
        "find":item._id,
        "date":new Date().getTime(),
        "status":"want"
      }));
      dispatch(cartActions.addItem({
        "item":{
        id:item._id,
        vendorId:item.userId,
        productName:item.title,
        price:item.price,
        imgUrl:item.img,
        "link":link||"",
        },
        qty:1
       }));
    }
  }

  return (


    <Col lg="3" md="4" className="mb-2">
      <div className="product__item">
        <div className="product__img">
         <Link to={`/shop/${item._id}`}>
          <motion.img whileHover={{scale:0.9}} img src={item.img} alt="" />
          </Link>
        </div>
        <div className="p-2 product__info">
          <h3 className="product__name">
            <Link to={`/shop/${item._id}`}>
              {item.title}
            </Link> 
          </h3>
          <span >{item.category}</span>
        </div>
        <div className="product__card-bottom d-flex align-item-center justify-content-between p-2">
          <span className="price">${item.price}</span>
          <motion.span  whileTap={{scale:1.2}} onClick={addToCart} ><i class="ri-add-line" ></i></motion.span>
        </div>
      </div>
    </Col>
  )
}

export default ProductCard