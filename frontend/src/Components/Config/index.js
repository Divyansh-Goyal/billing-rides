// src/components/Login.js
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { configuration, loginUser } from "../../Redux";
import { store } from "../../Redux/store";
import { redirect, useNavigate } from "react-router-dom";
import { makeApiCalls } from "../../Networking";
import { server_url } from "../../Constant";
import Logout from "../Auth/logoutHeader";
// Create this action to handle login logic

function Configuration() {
  const navigate = useNavigate();
  const [weekData, setWeekData] = useState({})
  const getData = async () => {
    const req = {
      method: 'GET',
      url: server_url+ `config/'0'`,
    };
    const data = await makeApiCalls(req);
    if (data.data) {
      setWeekData(data.data)
      store.dispatch(configuration(data.data));
    }
  }
  useEffect( () => {
   getData()
  }, []);

  return (
    <div>
      <Logout/>
    <table>
      <thead>
        <tr>
          <th>Day</th>
          <th>Distance base price</th>
          <th>Distance additional price</th>
          <th>Time multiplier_factor</th>
          <th>Waiting Charge</th>
        </tr>
      </thead>
      <tbody>
        {Object.values(weekData).map((row) => (
          <tr key={row.id}>
            <td>{row.day}</td>
            <td>{row.distance_base_price}</td>
            <td>{row.distance_additional_price}</td>
            <td>{row.time_multiplier_factor}</td>
            <td>{row.waiting_charge}</td>
            <td>
              <button onClick={() => navigate("/config/" + row.id)}>
                Edit
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  );
}

export default Configuration;
