import dayjs from "dayjs";

export function validatePhoneNumber(phone) {
  if (!phone) return false;
  const regexPhoneNumber = /((84|0|\+84)[3|5|7|8|9])+([0-9]{8})\b/g;
  return !!phone.match(regexPhoneNumber);
}

export function validateEmail(email) {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
}

export function validatePassword(
  string = "",
  regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,16}$/
) {
  return regex.test(string);
}

export function spliceSplit(str, index, count, add) {
  if (typeof str === "number") str = str.toString();
  if (typeof str !== "string") return "";
  let ar = str.split("");
  ar.splice(index, count, add);
  return ar.join("");
}

export function paramsToArraySearch(params) {
  let result = [];
  for (const [key, value] of params.entries()) {
    // each 'entry' is a [key, value] tupple
    result.push({ field: key.replace("_search", ""), value });
  }
  return result;
}

export function rangePickerToArrayDate(from_date, to_date) {
  let arrayDate = [],
    intDate = from_date;
  if (typeof from_date !== "string" || typeof to_date !== "string") return [];
  do {
    arrayDate.push(intDate);
    intDate = dayjs(intDate).add(1, "day").format("YYYY-MM-DD");
  } while (intDate <= to_date);
  return arrayDate;
}

export function newObjectKeys(originalObject, necessaryKeys) {
  return Object.fromEntries(
    Object.entries(originalObject)
      .filter(([key, value]) => necessaryKeys.includes(key))
      .map(([key, value]) => [key, value])
  );
}

export function groupByMultipleKeys(array, keys, mode = "array") {
  if (!Array.isArray(array)) return false;
  let group = {};
  for (let item of array) {
    let key;
    if (typeof keys === "string") {
      key = keys;
    } else {
      let listKey = [];
      for (let i of keys) {
        if (item[i] === undefined) continue;
        listKey.push(item[i]);
      }
      if (listKey.length !== keys.length) continue;
      key = listKey.join("-");
    }

    if (!group[key]) {
      group[key] = {
        ...newObjectKeys(item, keys),
        list: [item],
      };
    } else {
      group[key].list.push(item);
    }
  }

  return mode === "array" ? Object.values(group) : group;
}

export function formatNumberTimeToString(time) {
  if (typeof time === "string" || !time) return time;
  const minute = time % 100;
  const hour = Math.trunc(time / 100);
  const strMinute = minute < 10 ? `0${minute}` : `${minute}`;
  const strHour = hour < 10 ? `0${hour}` : `${hour}`;
  return `${strHour}:${strMinute}`;
}

export function findMaxMinDate(dates) {
  // Chuyển đổi các chuỗi thành đối tượng Date
  if (dates.length) {
    const dateObjects = dates?.map((date) => new Date(date));

    // Tìm min và max
    const minDate = new Date(Math.min(...dateObjects));
    const maxDate = new Date(Math.max(...dateObjects));

    return {
      minDate: minDate.toISOString().split("T")[0],
      maxDate: maxDate.toISOString().split("T")[0],
    };
  }
  return {
    minDate: '',
    maxDate: '',
  };
}

export function groupByTimeFrames(schedule) {
  const grouped = {};

  schedule.group_day.forEach((group) => {
    // Sort the time frames and normalize them to a string for comparison
    const normalizedTimeFrames = JSON.stringify(
      group.time_frames.sort(
        (a, b) =>
          (a.from_time > b.from_time ? 1 : -1) ||
          (a.to_time > b.to_time ? 1 : -1)
      )
    );

    // If this time frame set doesn't exist, create it in the grouped object
    if (!grouped[normalizedTimeFrames]) {
      grouped[normalizedTimeFrames] = [];
    }

    // Add the premium_type_id to the corresponding time frame group
    grouped[normalizedTimeFrames].push(...group.premium_type_id);
  });

  // Convert the grouped object into an array of results
  const result = Object.keys(grouped).map((key) => ({
    time_frames: JSON.parse(key),
    premium_type_id: grouped[key],
  }));

  return result;
}
