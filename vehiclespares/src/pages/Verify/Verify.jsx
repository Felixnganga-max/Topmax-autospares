import React, { useContext, useEffect } from 'react'
import axios from 'axios' // Add this import
import './Verify.css'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ShopContext } from '../../context/ShopContext';


const Verify = () => {
    const [searchParams] = useSearchParams();
    const success = searchParams.get("success") === "true" // Convert to boolean
    const orderId = searchParams.get("orderId")
    const {url} = useContext(ShopContext) 
    const navigate = useNavigate()   

    const verifyPayment = async () => {
        try {
            console.log("Sending verification request:", {
                success: success,
                orderId: orderId
            });

            const response = await axios.post(`${url}/api/order/verify`, {
                success: String(success), // Ensure we're sending a string
                orderId
            });
            
            console.log("Server response:", response.data);
            
            if (response.data.success) {
                navigate("/my-orders")
            } else {
                navigate("/")
            }
        } catch (error) {
            console.error("Payment verification failed:", error);
            navigate("/")
        }
    }

    useEffect(() => {
        verifyPayment();
    }, [])

    return (
        <div className='verify'>
            <div className="spinner"></div>
        </div>
    )
}

export default Verify;