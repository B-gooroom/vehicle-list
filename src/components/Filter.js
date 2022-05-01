import { useEffect, useState } from 'react';
import { inject } from 'mobx-react';
import { IoMdClose } from 'react-icons/io';
import { GrPowerReset } from "react-icons/gr"
import { useLocation, useNavigate } from 'react-router-dom';

function Filter(props) {
  const defaultModelTypes = () => {
    return {
      small: false,
      middle: false,
      large: false,
      income: false,
      suv: false
    }
  };

  const defaultModelZones = () => {
    return {
      SKI: false,
      J: false,
      BC: false,
      TK: false,
      D: false,
      G: false
    }
  };
  const { modelClassesStore } = props;
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const spModelTypes = searchParams.get('modelTypes') || JSON.stringify(defaultModelTypes());
  const spModelZones = searchParams.get('modelZones') || JSON.stringify(defaultModelZones());
  const spOrderBy = searchParams.get('orderBy') || 'asc';
  const modelTypeTag = searchParams.get('modelTypeTag') || '';

  const [modelTypes, setModelTypes] = useState(JSON.parse(spModelTypes));
  const [modelZones, setModelZones] = useState(JSON.parse(spModelZones));
  const [orderBy, setOrderBy] = useState(spOrderBy);

  useEffect(() => {
    const scroll = event => {
      if (window.scrollY > 60) {
        document.getElementsByClassName('filter')[0].classList.add('float');
      } else {
        document.getElementsByClassName('filter')[0].classList.remove('float');
      }
    };
    window.addEventListener('scroll', scroll);
    return () => {
      window.removeEventListener('scroll', scroll);
    }
  }, []);

  useEffect(() => {
    const conditions = {
      modelTypes: JSON.parse(spModelTypes),
      modelZones: JSON.parse(spModelZones),
      orderBy: spOrderBy,
      modelTypeTag
    };
    console.log({conditions})
    modelClassesStore.modelClassesRead(conditions);
  }, [modelClassesStore, spModelTypes, spModelZones, spOrderBy, modelTypeTag])

  const toggleFilter = (index) => {
    [1, 2, 3].map((i) => {
      if (i === index) {
        document.getElementsByClassName(`filter-wrapper-${i}`)[0].classList.toggle('d-none');
      } else {
        document.getElementsByClassName(`filter-wrapper-${i}`)[0].classList.add('d-none');
      }
      return 0;
    })
    document.body.classList.toggle('o-hidden');
  };

  const modelClassesRead = (modelTypeTag) => {
    if ( modelTypeTag === 'reset') {
      navigate(`/list`);
      carClassesRemove('modelTypes');
      carClassesRemove('modelZones');
    } else {
      navigate(`/list?modelTypes=${JSON.stringify(modelTypes)}&modelZones=${JSON.stringify(modelZones)}&orderBy=${orderBy}&modelTypeTag=${modelTypeTag || ''}`);
    }
  };

  const carClassesRemove = (name) => {
    let conditions = { orderBy };
    if (name === 'modelTypes') {
      setModelTypes(defaultModelTypes());
      conditions = {
        ...conditions,
        modelTypes: defaultModelTypes(),
        modelZones
      };
    } else if (name === 'modelZones') {
      setModelZones(defaultModelZones());
      conditions = {
        ...conditions,
        modelTypes,
        modelZones: defaultModelZones()
      };
    }
    modelClassesStore.modelClassesRead(conditions);
  };

  return (
    <nav className="filter">
      <ul>
        <div className="reset pointer">
          <GrPowerReset onClick={()=>{modelClassesRead('reset');}} />
        </div>
        <li>
          <div className={`basic${(modelTypes.small || modelTypes.middle || modelTypes.large || modelTypes.income || modelTypes.suv) ? ' selected' : ''}`}
            onClick={()=>{toggleFilter(1)}}
          >차종 분류 <IoMdClose className="filter-close pointer" onClick={(event)=>{event.stopPropagation(); carClassesRemove('modelTypes')}}/></div>
        </li>
        <li>
          <div className={`basic${(modelZones.SKI || modelZones.J || modelZones.BC || modelZones.TK || modelZones.D || modelZones.G) ? ' selected' : ''}`}
            onClick={()=>{toggleFilter(2)}}
          >지역<IoMdClose className="filter-close pointer" onClick={(event)=>{event.stopPropagation(); carClassesRemove('modelZones')}}/></div>
        </li>
        <li>
          <div className="basic"
            onClick={()=>{toggleFilter(3)}}
          >가격</div>
        </li>
        <li>
          <div className={`special${(modelTypeTag === '빠른대여') ? ' selected' : ''}`}
            onClick={()=>{modelClassesRead('빠른대여')}}
          >빠른대여<span className="dot"></span></div>
        </li>
        <li >
          <div className={`special${(modelTypeTag === '신차급') ? ' selected' : ''}`}
            onClick={()=>{modelClassesRead('신차급');}}
          >신차<span className="dot"></span></div>
        </li>
        <li>
          <div className={`special${(modelTypeTag === '인기') ? ' selected' : ''}`}
            onClick={()=>{modelClassesRead('인기')}}
          >인기<span className="dot"></span></div>
        </li>
        <li>
          <div className={`special${(modelTypeTag === '특가') ? ' selected' : ''}`}
            onClick={()=>{modelClassesRead('특가')}}
          >특가<span className="dot"></span></div>
        </li>
      </ul>
      <div className="filter-wrapper-1 d-none">
        <div className="type-filter">
          <ul>
            <li className={`list-box${modelTypes.small ? ' selected' : ''}`} onClick={() => {
              setModelTypes({
                ...modelTypes,
                small: !modelTypes.small
              });
              
            }}>경형/소형</li>
            <li className={`list-box${modelTypes.middle ? ' selected' : ''}`} onClick={() => {
              setModelTypes({
                ...modelTypes,
                middle: !modelTypes.middle
              });
            }}>준중형</li>
            <li className={`list-box${modelTypes.large ? ' selected' : ''}`} onClick={() => {
              setModelTypes({
                ...modelTypes,
                large: !modelTypes.large
              });
            }}>중형/대형</li>
            <li className={`list-box${modelTypes.income ? ' selected' : ''}`} onClick={() => {
              setModelTypes({
                ...modelTypes,
                income: !modelTypes.income
              });
            }}>수입</li>
            <li className={`list-box${modelTypes.suv ? ' selected' : ''}`} onClick={() => {
              setModelTypes({
                ...modelTypes,
                suv: !modelTypes.suv
              });
            }}>SUV</li>
          </ul>
        </div>
        <IoMdClose className="close pointer" onClick={()=>{toggleFilter(1); modelClassesRead();}}/>
      </div>
      <div className="filter-wrapper-2 d-none">
        <div className="region-filter">
          <ul>
          <li className={`list-box${modelZones.SKI ? ' selected' : ''}`} onClick={() => {
              setModelZones({
                ...modelZones,
                SKI: !modelZones.SKI
              });
            }}>서울/경기/인천</li>
            <li className={`list-box${modelZones.J ? ' selected' : ''}`} onClick={() => {
              setModelZones({
                ...modelZones,
                J: !modelZones.J
              });
            }}>제주도</li>
            <li className={`list-box${modelZones.BC ? ' selected' : ''}`} onClick={() => {
              setModelZones({
                ...modelZones,
                BC: !modelZones.BC
              });
            }}>부산/창원</li>
            <li className={`list-box${modelZones.TK ? ' selected' : ''}`} onClick={() => {
              setModelZones({
                ...modelZones,
                TK: !modelZones.TK
              });
            }}>대구/경북</li>
            <li className={`list-box${modelZones.D ? ' selected' : ''}`} onClick={() => {
              setModelZones({
                ...modelZones,
                D: !modelZones.D
              });
            }}>대전광역시</li>
            <li className={`list-box${modelZones.G ? ' selected' : ''}`} onClick={() => {
              setModelZones({
                ...modelZones,
                G: !modelZones.G
              });
            }}>광주광역시</li>
          </ul>
        </div>
        <IoMdClose className="close pointer" onClick={()=>{toggleFilter(2); modelClassesRead();}}/>
      </div>
      <div className="filter-wrapper-3 d-none">
        <div className="price-filter">
          <ul>
            <li className={`list-box${orderBy === 'asc' ? ' selected' : ''}`} onClick={() => {
              setOrderBy('asc');
            }}>낮은 가격순</li>
            <li className={`list-box${orderBy === 'desc' ? ' selected' : ''}`} onClick={() => {
              setOrderBy('desc');
            }}>높은 가격순</li>
          </ul>
        </div>
        <IoMdClose className="close pointer" onClick={()=>{toggleFilter(3); modelClassesRead();}}/>
      </div>
    </nav>
  )
}

export default inject('modelClassesStore')(Filter);
