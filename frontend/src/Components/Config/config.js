// src/components/Login.js
import React, { useEffect, useState } from 'react';
import { connect, useSelector } from 'react-redux';
import { Configuration, loginUser } from '../../Redux';
import { store } from '../../Redux/store';
import { redirect, useNavigate, useParams } from 'react-router-dom';
import { makeApiCalls } from '../../Networking';
import { server_url } from '../../Constant';
import Logout from '../Auth/logoutHeader';
import CalculateFare from './calculateFare';
 // Create this action to handle login logic

const Config = () => {
  const navigate = useNavigate()
    const { id } = useParams();
    const data = useSelector((state) => state.Configuration.data)
    const [user, setUser] = useState({})
    useEffect( () => {
      const congif = Object.values(data).find((item) => item.id === Number(id));
      setUser(congif)
     }, [id]);
    const handleFormSubmit = async (e) => {
      console.log(user);
      e.preventDefault();
      const req = {
        method: 'PUT',
        url: server_url + `config/${id}`,
        data: {
          ...user
        }
      };
      const data = await makeApiCalls(req);
      if (data) {
        navigate('/config')
      }
      // Handle the form submission logic here, e.g., updating the user data
    };
    if(!Object.keys(user).length){
      const view = <div>No record found </div>
    }
    const view = (
      <div>
        <h2>Edit Configuration {user.day}</h2>
        <form onSubmit={handleFormSubmit}>
          <div>
          <label>
            Distance base price:
            <input type="number" value={user.distance_base_price} onChange={(e) => setUser({...user, distance_base_price: e.target.value})} />
          </label>
          <label>
            Distance additional price/km:
            <input type="number" value={user.distance_additional_price} onChange={(e) => setUser({...user, distance_additional_price: e.target.value})} />
          </label>
          </div>
          <div>
          <label>
            Time multiplier factor/hour:
            <input type="number" value={user.time_multiplier_factor} onChange={(e) => setUser({...user, time_multiplier_factor: e.target.value})} />
          </label>
          <label>
            Waiting charge:
            <input type="number" value={user.waiting_charge} onChange={(e) => setUser({...user, waiting_charge: e.target.value})} />
          </label>
          </div>
          <div>
          <label>
            Distance base km:
            <input type="number" value={user.distance_base_km} onChange={(e) => setUser({...user, distance_base_km: e.target.value})} />
          </label>
          <label>
            Base waiting time:
            <input type="number" value={user.base_waiting_time} onChange={(e) => setUser({...user, base_waiting_time: e.target.value})} />
          </label>
          </div>
          <button type="submit">Save Changes</button>
        </form>
      </div>
    );
    return( 
    <div>
      <Logout/>
      {view}
      <div>
      <CalculateFare id={id}/>
      </div>
    </div>
    );
};

export default Config;
