interface OneWord{
  "단어명":string;
  "영문한문":string;
  "뜻":string;
}

interface Category{
  response: Array<OneWord>
}

export default function CategoryResult({response}:Category){
  console.log(response);
  return (
    <div>
      <p>CategoryResult</p>
      {response && response.map((v,i)=>
        <div className="border border-black" key={i}>
          <p>{v.단어명}</p>
          <p>{v.영문한문}</p>
          <p>{v.뜻}</p>
        </div>
      )}
    </div>
  )
}