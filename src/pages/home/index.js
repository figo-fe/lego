import React, { useEffect } from 'react';
import { GuideHome } from '../guide';

export const Home = ({ history, homeUrl }) => {
  useEffect(() => {
    if (homeUrl) {
      history.replace(homeUrl);
    }
  }, [history, homeUrl]);

  return history === '' ? <GuideHome /> : null;
};
