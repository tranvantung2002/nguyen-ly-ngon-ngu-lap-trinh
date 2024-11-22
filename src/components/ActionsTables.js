import React, { useState } from "react";
import { notification, Popconfirm, Tooltip } from "antd";
import PropTypes from "prop-types";
import request from "../config/axiosConfig";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

export const ACTION_CODE = {
  VIEW: 1,
  ADD: 2,
  EDIT: 3,
  DELETE: 4,
  COPPY: 5
}

const iconAction = {
  1: {
    icon: <i className="fa-solid fa-eye"></i>,
    class: 'bg-amber-400 text-white',
    toltip: 'Xem'
  },
  2: {
    icon: <i className="fa-solid fa-plus"></i>,
    class: 'bg-blue-400 text-white',
    toltip: 'Thêm'
  },
  3: {
    icon: <i className="fa-light fa-pen-to-square"></i>,
    class: 'bg-[#52C41A] text-white',
    toltip: 'Sửa'
  },
  4: {
    icon: <i className="fa-regular fa-trash"></i>,
    class: 'bg-[#FF4D4F] text-white',
    toltip: 'Xoá'
  },
  5: {
    icon: <i className="fa-regular fa-copy"></i>,
    class: 'bg-[#4A90E2] text-white',
    toltip: 'Copy'
  },
};
const ActionsTables = ({ action = [] }) => {
  const [state, setState] = useState({});
  const userInfo = useSelector((state) => state.user.info);
  const location = useLocation();
  // 1 -> 5 : xem , thêm ,  sửa , xoá , copy

  const handleClick = async (item, index) => {
    const { data, url, method } = item;
    if (!url || !method) return null;
    if (state[index]) {
      notification.warning({ message: 'Chức năng đang được thực hiện!' })
      return null;
    }
    let config = { url, method };
    if (data) {
      if (method?.toUpperCase() === 'GET') config.params = data;
      else config.data = data;
    }
    setState(prevState => ({ ...prevState, [index]: true }));
    await request(config).then(res => {
      if (item.messageSuccess) {
        notification.success({ message: item.messageSuccess });
      }
      if (typeof item.afterAction === 'function') {
        item.afterAction(res.data, item);
      }
      return res.data;
    }).catch(error => {
      notification.error({ message: error.data?.message || 'Có lỗi xảy ra vui lòng thử lại sau!' });
    })
    setState(prevState => ({ ...prevState, [index]: false }));
  }

  return (
    <div className={'flex justify-start gap-2 '}>
      {
        Array.isArray(action) && action.map((item, key) => {
          const check_permission = userInfo.permissions?.some(
            i => (i.action_id === item.id || (i.action_id === 2 && item.id === 5)) && i.url === location.pathname
          ) || userInfo.role === 9999;
          return (
            (item.active === undefined || item.active) && check_permission &&
            <div
              key={key}
              className={'cursor-pointer'}
            >
              {
                item.id === 4 ?
                  <Tooltip
                    placement="top"
                    title={item.tooltip || iconAction[item.id]?.toltip || ''}
                    color={'#e2e8f0'}
                    overlayInnerStyle={{ color: '#374151' }}
                  >
                    <Popconfirm
                      title="Xoá dữ liệu"
                      description="Bạn có chắc chắn xoá không?"
                      okButtonProps={{
                        style: { fontSize: 14, height: 30 }
                      }}
                      cancelButtonProps={{
                        style: { fontSize: 14, height: 30 }
                      }}
                      okText='Đồng ý'
                      cancelText='Huỷ'
                      onConfirm={typeof item.func === 'function' ? item.func : () => handleClick(item, key)}
                    >
                      <span
                        title={item.tooltip || iconAction[item.id]?.toltip || ''}
                        className={`w-7 h-7 flex items-center justify-center rounded ${item.class || iconAction[item.id]?.class || ''}`}
                      >
                        {item.icon || iconAction[item.id]?.icon || <i className="fa-solid fa-ellipsis"></i>}
                      </span>
                    </Popconfirm>
                  </Tooltip>
                  :
                  <div onClick={typeof item.func === 'function' ? item.func : () => handleClick(item, key)}>
                    <Tooltip
                      placement="top"
                      title={item.tooltip || iconAction[item.id]?.toltip || ''}
                      color={'#e2e8f0'}
                      overlayInnerStyle={{ color: '#374151' }}
                    >
                      <span
                        className={`w-7 h-7 flex items-center justify-center rounded ${item.class || iconAction[item.id]?.class || ''}`}
                      >
                        {item.icon || iconAction[item.id]?.icon || <i className="fa-solid fa-ellipsis"></i>}
                      </span>
                    </Tooltip>
                  </div>
              }

            </div>
          )
        })
      }
    </div>
  )
}

ActionsTables.propTypes = {
  action: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOf([1, 2, 3, 4, 5]),
    func: PropTypes.func,
    url: PropTypes.string,
    tooltip: PropTypes.string,
    class: PropTypes.string,
    messageSuccess: PropTypes.string,
    icon: PropTypes.node,
    method: PropTypes.oneOf(['POST', 'GET', 'PUT', 'DELETE']),
    afterAction: PropTypes.func,
    data: PropTypes.object,
    active: PropTypes.bool
  })).isRequired
}
export default ActionsTables;
