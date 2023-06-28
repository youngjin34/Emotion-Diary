import React, { useReducer, useRef } from "react";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import New from "./pages/New";
import Edit from "./pages/Edit";
import Diary from "./pages/Diary";

import './App.css';

const reducer = (state, action) => {
  let newState = [];
  switch (action.type) {
    case `INIT`: {
      return action.data;
    }
    case `CREATE`: {
      const newItem = {
        ...action.data
      };
      newState = [newItem, ...state];
      break;
    }
    case `REMOVE`: {
      newState = state.filter((it) => it.id !== action.targetId);
      break;
    }
    case `EDIT`: {
      newState = state.map((it) => it.id === action.data.id ? { ...action.data } : it);
      break;
    }
    default:
      return state;
  }
  return newState;
};

export const DiaryStateContext = React.createContext();
export const DiaryDispatchContext = React.createContext();

const dummyData = [
  {
    id: 1,
    title: "일기",
    emotion: 1,
    content: "일기 만든다 어쩔?",
    date: 1687911375939
  },
  {
    id: 2,
    title: "일기2",
    emotion: 2,
    content: "일기 만든2다 어쩔?",
    date: 1687911375940
  },
  {
    id: 3,
    title: "일기3",
    emotion: 3,
    content: "일기 만든다 어쩔?zzz",
    date: 1687911375941
  },
  {
    id: 4,
    title: "일기4",
    emotion: 4,
    content: "일기 만든다 어쩔?",
    date: 1687911375942
  },
  {
    id: 5,
    title: "일기5",
    emotion: 5,
    content: "일기 만든다 어쩔?",
    date: 16879113759343
  },
];

function App() {

  const [data, dispatch] = useReducer(reducer, dummyData);
  const dataId = useRef(0);

  const onCreate = (title, date, content, emotion) => {
    dispatch({
      type: "CREATE", data: {
        id: dataId.current,
        date: new Date(date).getTime(),
        title,
        content,
        emotion,
      }
    });
    dataId.current += 1;
  };

  const onRemove = (targetId) => {
    dispatch({ type: "REMOVE", targetId });
  }
  const onEdit = (targetId, date, title, content, emotion) => {
    dispatch({
      type: "EDIT",
      data: {
        id: targetId,
        date: new Date(date).getTime(),
        title,
        content,
        emotion
      }
    });
  };

  return (
    <DiaryStateContext.Provider value={data}>
      <DiaryDispatchContext.Provider value={
        { onCreate, onRemove, onEdit }
      }>
        <BrowserRouter>
          <div className='App'>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/new' element={<New />} />
              <Route path='/edit' element={<Edit />} />
              <Route path='/diary/:id' element={<Diary />} />
              {/* <Route path='/diary' element={<Diary />} />  
          를 넣으면 :id가 없는 diary 첫 페이지로 간다. */}
            </Routes>
          </div>
        </BrowserRouter>
      </DiaryDispatchContext.Provider>
    </DiaryStateContext.Provider>
  );
}

export default App;