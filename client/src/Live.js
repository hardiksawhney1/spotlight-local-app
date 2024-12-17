import React from 'react';
import { List } from './List';
import { Anchor } from './Anchor';
import { Operations } from './Operations';
import './Live.module.css';

export const Live = () => {
  return (
    <div className="liveContainer">
      {/* Left section with List component (40% width) */}
      <div className="leftSection">
        <List />
      </div>

      {/* Right section with Anchor (60% height) and Operations (40% height) components */}
      <div className="rightSection">
        {/* Top section with Anchor component */}
        <div className="anchorSection">
          <Anchor />
        </div>

        {/* Bottom section with Operations component */}
        <div className="operationsSection">
          <Operations />
        </div>
      </div>
    </div>
  );
};
