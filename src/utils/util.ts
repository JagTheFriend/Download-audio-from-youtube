import { DataToSend, ResponseReceived, ValidityCheckOnly, VideoFormat } from '@/interfaces/video.interface';
import { YOUTUBE_API_KEY } from '@config';
import fetch from 'cross-fetch';

const validityCheckUrl = `https://www.googleapis.com/youtube/v3/videos?part=id&key=${YOUTUBE_API_KEY}&id=`;
const videoFinderUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&key=${YOUTUBE_API_KEY}&type=video&maxResults=18&q=`;

/**
 * @method isEmpty
 * @param {String | Number | Object} value
 * @returns {Boolean} true & false
 * @description this value is Empty Check
 */
export const isEmpty = (value: string | number | object): boolean => {
  if (value === null) {
    return true;
  } else if (typeof value !== 'number' && value === '') {
    return true;
  } else if (typeof value === 'undefined' || value === undefined) {
    return true;
  } else if (value !== null && typeof value === 'object' && !Object.keys(value).length) {
    return true;
  } else {
    return false;
  }
};

/**
 * @method checkValidity
 * @param {String} videoId
 * @returns {Promise<Boolean>} A promise containing true or false
 * @description whether the video id is Valid Check
 */
export async function checkValidity(videoId: string): Promise<boolean> {
  const response = await fetch(validityCheckUrl + videoId);
  const data: ValidityCheckOnly = await response.json();
  return data.pageInfo.totalResults !== 0;
}

/**
 * @method searchSong
 * @param {String} songName
 * @returns {Promise<DataToSend>} A promise containing data to be sent
 * @description searches for a songs with similar names which is provided by the user
 */
export async function searchSong(songName: string): Promise<DataToSend[]> {
  const response = await fetch(videoFinderUrl + songName);
  const data: ResponseReceived = <ResponseReceived>await response.json();
  const dataToSend: VideoFormat[] = [];
  for (const key of data.items) {
    dataToSend.push({
      nextPageToken: data.nextPageToken,
      videoId: key.id.videoId,
      title: key.snippet.title,
      description: key.snippet.description,
      thumbnailLink: key.snippet.thumbnails.medium.url,
    });
  }
  return dataToSend;
}
