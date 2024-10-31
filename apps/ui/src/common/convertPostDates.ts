import moment from 'moment-timezone';

export const convertPostDates = (
  data: Array<{ createdAt: string | Date; updatedAt: string | Date }>
) => {
  return data.reverse().map((v) => {
    v.createdAt = moment(v.createdAt).tz('Asia/Seoul').fromNow();
    v.updatedAt = moment(v.updatedAt).tz('Asia/Seoul').fromNow();
    return v;
  });
};
