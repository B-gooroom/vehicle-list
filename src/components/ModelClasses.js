import { inject, observer } from 'mobx-react';
import { IoMdThumbsUp, IoMdTrendingDown } from 'react-icons/io';
import { MdBolt } from 'react-icons/md';
import { FaCarSide } from 'react-icons/fa';
import { RiVipCrown2Fill } from 'react-icons/ri';
import Spinner from './Spinner.js';

function ModelClasses(props) {
  const { modelClassesStore } = props;
  const { modelClasses, isLoading } = modelClassesStore;

  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  };

  const formatDistance = (num) => {
    if (num >= 10000) {
      num = formatNumber(num / 10000) + '만';
    } else if (num >= 1000){
      num = formatNumber(num / 1000) + '천';
    }
    return num;
  };

  if (isLoading) {
    return <Spinner />
  }
  
  return (
    <section className="contents">
      {modelClasses.map((modelClass, indexCarClass) => (
        <div key={indexCarClass} className="car-classes">
          <div className="car-img">
            <img width="380" src={modelClass.modelImage} alt={modelClass.modelName} />
          </div>
          <div className="car-class">
            <ul>
              <li className='car-name'>{modelClass.modelName}</li>
              <li className='car-price'><span>{formatNumber(Math.round(modelClass.modelPrice / 10000) * 10000)}원 </span><span className='highlight'> ( -{modelClass.discountPercentage}%) </span></li>
              <li className='car-details'>
                <span> {modelClass.modelYear}년 |</span>
                <span> {formatDistance(modelClass.totalDistance)}km |</span>
                <span> {modelClass.modelZones.join(', ')}</span>
              </li>
            </ul>
            <div className="car-type-tags">
            {modelClass.modelTypeTags && modelClass.modelTypeTags.map((modelTypeTag, indexCarTypeTag) => (
                <label key={indexCarTypeTag}>
                  {modelTypeTag === '인기' ? (
                    <span><IoMdThumbsUp style={{verticalAlign: 'text-top'}}/> {modelTypeTag}</span>
                  ) : modelTypeTag === '특가' ? (
                    <span><IoMdTrendingDown style={{verticalAlign: 'text-top'}}/> {modelTypeTag}</span>
                  ) : modelTypeTag === '빠른대여' ? (
                    <span><MdBolt style={{verticalAlign: 'text-top'}}/> {modelTypeTag}</span>
                  ) : modelTypeTag === '신차급' ? (
                    <span><FaCarSide style={{verticalAlign: 'text-bottom'}}/> {modelTypeTag}</span>
                  ) : modelTypeTag === '프리미엄' ? (
                    <span><RiVipCrown2Fill style={{verticalAlign: 'text-top'}}/> {modelTypeTag}</span>
                  ) : null }
                </label>
              ))}
            </div>
          </div>
        </div>
      ))}
      {modelClasses.length === 0 && (
        <div className="empty">
          <p>선택하신 조건에 맞는 차량이 없습니다.</p>
          <p>준비된 다른 차량을 확인해 보세요!</p>
        </div>
      )}
    </section>
  )
}

export default inject('modelClassesStore')(observer(ModelClasses));
