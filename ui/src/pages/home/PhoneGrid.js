import { Paper, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import React,{useEffect, useState} from 'react';
import {FixedSizeList } from 'react-window';
import InfiniteLoader from "react-window-infinite-loader";
import { format, formatDistance} from 'date-fns';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  row: {
    flexGrow: 1,
    padding: theme.spacing(1),
    height: `calc(120px - ${theme.spacing(1)}px)`,
  }
}));

const ListComponent = ({ items, isNextPageLoading, loadNextPage, hasNextPage }) => {
  const classes = useStyles();
  // If there are more items to be loaded then add an extra row to hold a loading indicator.
  const itemCount = hasNextPage ? items.length + 1 : items.length;

  // Only load 1 page of items at a time.
  // Pass an empty callback to InfiniteLoader in case it asks us to load more than once.
  const loadMoreItems = isNextPageLoading ? () => {} : loadNextPage;

  // Every row is loaded except for our loading indicator row.
  const isItemLoaded = index => !hasNextPage || index < items.length;
  const Row = ({ index, style }) => {
     /* define the row component using items[index] */
     const pinfo = items[index];
     
     if (!isItemLoaded(index)) {
      return (
        <Paper className={classes.row}>
         <Typography variant='h6'>loading...</Typography>
        </Paper>
       );
     }
     return (
      <Paper className={classes.row}>
       <Typography component='span' variant='h6'>{`+91 ${pinfo.phonenumber}`}</Typography>
       &nbsp;&nbsp;
       <Typography component='span' variant='caption'>
          {formatDistance(new Date(pinfo.createdAt["_seconds"] * 1000), new Date(), { addSuffix: true })}
       </Typography>
      </Paper>
     );
  };

  return (
    <InfiniteLoader
      isItemLoaded={isItemLoaded}
      itemCount={itemCount}
      loadMoreItems={loadMoreItems}
    >
      {({ onItemsRendered, ref }) => (
        <FixedSizeList
          height={500}
          width={'100%'}
          itemCount={itemCount}
          itemSize={120}
          onItemsRendered={onItemsRendered}
          ref={ref}
        >
          {Row}
        </FixedSizeList>
      )}
  </InfiniteLoader>
  )
};

export default function PhoneGrid({category, city, height}) {
  const [items, setItems] = useState([]);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isNextPageLoading, setIsNextPageLoading] = useState(false);

  useEffect(()=>{
    setItems([]);
    console.log('initial load.');
    setHasNextPage(true);
  }, [city, category]);

  const loadMore=()=>{
    console.log("loadNextPage");
    setIsNextPageLoading(true);
    try{
      const offset = items.length>0?items[items.length-1].createdAt["_seconds"]:0;
      let url=`/api/phone?offset=${offset}&limit=25&`;
      const filters=[]
      if (category) { filters.push(`category=${category}`); }
      if (city && city.city!=='') { filters.push(`city=${city}`); }

      url+=filters.join('&');
      axios.get(url)
        .then(res=>{
          setHasNextPage(res.data.length<26);
          setItems([...items].concat(res.data));
          //setHasNextPage(res.headers['hasmoredata']==='true');
        })
        .catch(err=>{

        })
        .finally(()=>{
          setIsNextPageLoading(false);
        })
    } catch (ex) {
      console.error(ex);
    }
  }

  return (
    <div style={{ height, width: '100%' }}>
      <div style={{ display: 'flex', height: '100%' }}>
        <div style={{ flexGrow: 1 }}>
          <ListComponent items={items} loadNextPage={loadMore} 
            hasNextPage={hasNextPage} isNextPageLoading={isNextPageLoading} />
        </div>
      </div>
    </div>
  );
}
