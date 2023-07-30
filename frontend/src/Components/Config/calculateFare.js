// src/components/Login.js
import React, { useEffect, useState } from 'react';
import { connect, useSelector } from 'react-redux';
import { Configuration, loginUser } from '../../Redux';
import { store } from '../../Redux/store';
import { redirect, useNavigate, useParams } from 'react-router-dom';
import { makeApiCalls } from '../../Networking';
import { server_url } from '../../Constant';
import Logout from '../Auth/logoutHeader';
 // Create this action to handle login logic

const CalculateFare = ({id}) => {
    const initialState = {
        date : new Date(),
        waiting_time: 0,
        distance: 0,
        time: 0,
        fare:0,
    }
    const [state, setState] = useState(initialState)
    const handleFormSubmit = async (e) => {
      e.preventDefault();
      var date = new Date(state.date);
      var day = date.getDay();
      const req = {
        method: 'POST',
        url: server_url + `calculation/`,
        data:{
          "distance_travelled": state.distance,
          "waiting_time": state.waiting_time,
          "time": state.time,
          "day": day
        }
      };
      const data = await makeApiCalls(req);
      if (data?.data?.price) {
         setState({...state, fare:data.data.price})
      }
      // Handle the form submission logic here, e.g., updating the user data
    };
    return( 
    <div>
        <h2>Calculate Fare </h2>
        <form onSubmit={handleFormSubmit}>
          <div>
          <label>
            Distance in km: 
            <input type="number" value={state.distance} onChange={(e) => setState({...state, distance: e.target.value})} />
          </label>
          <label>
            Date : 
            <input type="date" value={state.date} onChange={(e) => setState({...state, date: e.target.value})} />
          </label>
          </div>
          <div>
          <label>
            Time travel in hour :
            <input type="number" value={state.time} onChange={(e) => setState({...state, time: e.target.value})} />
          </label>
          <label>
            Waiting Time in min:
            <input type="number" value={state.waiting_time} onChange={(e) => setState({...state, waiting_time: e.target.value})} />
          </label>
          </div>
          <label>
            Fare:
            <input type="number" value={state.fare} disabled/>
          </label>
          <button type="submit">Save Changes</button>
        </form>
      </div>
    );
};

export default CalculateFare;
