import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DiaryDispatchContext } from '../App'

import MyButton from './MyButton';
import MyHeader from './MyHeader';
import EmotionItem from './EmotionItem';

import { getStringDate } from '../util/date';
import { emotionList } from '../util/emotion';



const DiaryEditor = ({ isEdit, originData }) => {
  const contentRef = useRef();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [emotion, setEmotion] = useState(3);
  const [date, setDate] = useState(getStringDate(new Date()));

  const { onCreate, onEdit, onRemove } = useContext(DiaryDispatchContext);
  const handleClickEmote = useCallback((emotion) => {
    setEmotion(emotion);
  }, []);

  const navigate = useNavigate();

  const handelSubmit = () => {
    if (content.length < 1) {
      contentRef.current.focus();
      return;
    }

    if (window.confirm(isEdit ? "일기를 수정하시겠습니까?" : "새로운 일기를 작성하시겠습니까?")) {
      if (!isEdit) {
        onCreate(date, content, title, emotion);
      } else {
        onEdit(originData.id, date, content, title, emotion)
      }
    }
    navigate('/', { replace: true });
  };

  const handleRemove = () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      onRemove(originData.id);
      navigate('/', { replace: true });
    }
  }

  useEffect(() => {
    if (isEdit) {
      setDate(getStringDate(new Date(parseInt(originData.date))));
      setTitle(originData.title);
      setEmotion(originData.emotion);
      setContent(originData.content);
    }
  }, [isEdit, originData])

  return (
    <div className='DiaryEditor'>
      <MyHeader
        headText={isEdit ? "일기 수정하기" : "새 일기 쓰기"}
        leftChild={
          <MyButton text={"< 뒤로가기"}
            onClick={() => navigate(-1)}
          />}
        rightChild={
          isEdit && (
            <MyButton text={"삭제하기"} type={"negative"} onClick={handleRemove} />
          )
        }
      />
      <div>
        <section>
          <h4>오늘은 언제인가요?</h4>
          <div className='input_box'>
            <input
              className='input_date'
              value={date}
              onChange={(e) => setDate(e.target.value)}
              type='date' />
          </div>
        </section>
        <section>
          <h4>제목</h4>
          <textarea
            className='DiaryEditor title'
            placeholder='제목을 입력해주세요'
            ref={contentRef}
            value={title}
            onChange={(e) => setTitle(e.target.value)} />
        </section>
        <section>
          <h4>오늘의 감정</h4>
          <div className='input_box emotion_list_wrapper'>
            {emotionList.map((it) => (
              <EmotionItem
                key={it.emotion_id}
                {...it}
                onClick={handleClickEmote}
                isSelected={it.emotion_id === emotion}
              />
            ))}
          </div>
        </section>
        <section>
          <h4>오늘의 일기</h4>
          <div className='input_box text_wrapper'>
            <textarea
              className='DiaryEditor content'
              placeholder='오늘은 어땠나요?'
              ref={contentRef}
              value={content}
              onChange={(e) => setContent(e.target.value)} />
          </div>
        </section>
        <section>
          <div className='control_box'>
            <MyButton text={"취소하기"} onClick={() => navigate(-1)} />
            <MyButton text={"작성 완료"} type={"positive"} onClick={handelSubmit} />
          </div>
        </section>
      </div>
    </div>
  );
};


export default DiaryEditor;