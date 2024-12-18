import axios from "axios";

interface OneWord{
  "단어명":string;
  "영문한문":string;
  "설명":string;
  "연관단어":string;
}

const searchOneWord = async (keyword: string):Promise<OneWord> => { 
  const base_url = process.env.NEXT_PUBLIC_ELASTICSEARCH_URL as string;
  console.log(base_url);

  const wrongSearch = {
    "단어명":"",
    "영문한문":"",
    "설명":"검색 결과가 없습니다.",
    "연관단어":""
  };

  const searchQuery = {
    "query": {
      "match": {
        "단어명": keyword
      }
    },
    "_source": ["단어명", "영문한문", "설명", "연관단어"]
  };
  const header = {
    headers: {
      'Content-Type': 'application/json'
    }
  }
  try {
    const response = await axios.post(`${base_url}/_search?pretty`, searchQuery, header);
    const hits = response.data.hits.hits;
    if (hits.length > 0) {
      const word = hits[0]._source;
      return {
        "단어명": word.단어명,
        "영문한문": word.영문한문,
        "설명": word.설명,
        "연관단어": word.연관단어
      };
    }
    return wrongSearch;
  } catch (error) {
    console.error("Error during search:", error);
    return wrongSearch;
  }
};

export default searchOneWord;