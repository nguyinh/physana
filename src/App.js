import React, { useState } from 'react';
import Table from './Table';
import './App.css';
import CSVReader from 'react-csv-reader';

const uglyString = 'mesriAge:mesriPoids:mesriTaille:mesriPds:mesriUnite:PdsRef:Temps scopie:mesriTscopMin:mesriTscopSec:AIR Kerma cumule:Nombre images:SALLE:Date Examen2:Titre Examen:Operateur1 nom:Date naissance;75:64:167:2:321: µGy.m²:0:6:::46:339:artis zee:07/01/2019:Coronarographie:MARCOLLET:27/10/1944;72:69:151:1:296: µGy.m²:0:35:::47:47:artis zee:11/01/2019:Coronarographie:MARCOLLET:02/03/1947;83:60:153:1:173: µGy.m²:1:3:::26:26:artis zee:11/01/2019:Coronarographie:MARCOLLET:27/08/1936;65:63:180:2:699: µGy.m²:2:07:::107:402:artis zee:11/01/2019:Coronarographie:DECHERY:17/03/1954;77:74:162:2:598: µGy.m²:0:7:::94:350:artis zee:14/01/2019:Coronarographie:MARCOLLET:09/06/1942;71:56:160:1:305: µGy.m²:1:17:::44:44:artis zee:14/01/2019:Coronarographie:MARCOLLET:22/07/1948;81:90:168:2:690: µGy.m²:1:13:::145:2300:artis zee:15/01/2019:Coronarographie:DECHERY:15/02/1938;90:95:165:2:4022: µGy.m²:3:65:::583:2186:artis zee:17/01/2019:Coronarographie:SEMAAN:07/07/1929;85:81:171:2:1414: µGy.m²:1:57:::238:238:artis zee:17/01/2019:Coronarographie:SEMAAN:18/09/1934;63:76:166:2:420: µGy.m²:1:35:::65:1103:artis zee:21/01/2019:Coronarographie:MARCOLLET:28/02/1956;68:54:158:1:191: µGy.m²:0:62:::32:32:artis zee:21/01/2019:Coronarographie:MARCOLLET:24/08/1951;78:79:166:1:425: µGy.m²:1:33:::83:1464:artis zee:22/01/2019:Coronarographie:DECHERY:20/01/1941;77:80:170:2:980: µGy.m²:2:38:::166:249:artis zee:22/01/2019:Coronarographie:DECHERY:01/01/1942;70:78:157:1:536: µGy.m²:0:85:::93:578:artis zee:23/01/2019:Coronarographie:MARCOLLET:28/03/1949;70:91:182:2:2242:99: µGy.m²:3:52:::477:477:artis zee:23/01/2019:Coronarographie:BOUSSAID:05/06/1949;47:57:163:1:323: µGy.m²:1:63:::61:61:artis zee:23/01/2019:Coronarographie:MARCOLLET:10/06/1972;59:100:180:2:1581: µGy.m²:3:78:::224:224:artis zee:24/01/2019:Coronarographie:SEMAAN:07/09/1960;73:80:156:1:518: µGy.m²:1:83:::96:1667:artis zee:25/01/2019:Coronarographie:DECHERY:06/02/1946;65:79:160:1:510: µGy.m²:0:6:::80:80:artis zee:25/01/2019:Coronarographie:MARCOLLET:25/08/1954;47:85:172:2:1395:46: µGy.m²:5:41:::276:587:artis zee:25/01/2019:Coronarographie:DECHERY:04/04/1972;87:55:148:1:416: µGy.m²:2:17:::63:63:artis zee:25/01/2019:Coronarographie:DECHERY:19/05/1932;70:74:165:2:895: µGy.m²:1:2:::142:247:artis zee:28/01/2019:Coronarographie:MARCOLLET:28/11/1949;70:83:168:2:1856: µGy.m²:7:73:::276:276:artis zee:29/01/2019:Coronarographie:DECHERY:23/01/1949;76:74:164:1:1465: µGy.m²:10:2:::227:1603:artis zee:29/01/2019:Coronarographie:DECHERY:13/10/1943;77:68:172:1:231: µGy.m²:1:67:::40:40:artis zee:31/01/2019:Coronarographie:DECHERY:12/11/1942;69:75:170:2:856: µGy.m²:4:72:::121:954:artis zee:01/02/2019:Coronarographie:DECHERY:13/02/1950;83:65:166:1:357: µGy.m²:1:07:::53:53:artis zee:04/02/2019:Coronarographie:MARCOLLET:27/11/1936;47:70:152:2:629: µGy.m²:1:54:::141:141:artis zee:05/02/2019:Coronarographie:BOUSSAID:30/04/1972;68:66:172:2:510: µGy.m²:1:45:::92:1003:artis zee:05/02/2019:Coronarographie:DECHERY:13/11/1951;68:70:158:1:449: µGy.m²:0:9:::65:65:artis zee:07/02/2019:Coronarographie:MARCOLLET:26/02/1951;62:83:180:2:898: µGy.m²:0:92:::153:153:artis zee:07/02/2019:Coronarographie:SEMAAN:04/03/1957;55:63:164:1:187: µGy.m²:0:32:::26:386:artis zee:08/02/2019:Coronarographie:MARCOLLET:25/05/1964;84:60:162:2:524: µGy.m²:1:3:::91:91:artis zee:08/02/2019:Coronarographie:DECHERY:19/12/1935;66:82:176:2:422: µGy.m²:0:83:::58:58:artis zee:12/02/2019:Coronarographie:MARCOLLET:08/01/1953;66:80:186:2:938: µGy.m²:4:4:::161:161:artis zee:12/02/2019:Coronarographie:BOUSSAID:18/08/1953;67:61:164:2:274: µGy.m²:0:97:::59:367:artis zee:12/02/2019:Coronarographie:MARCOLLET:18/11/1952;89:63:160:2:307: µGy.m²:0:4:::46:46:artis zee:13/02/2019:Coronarographie:DECHERY:22/09/1930;65:70:178:2:1595: µGy.m²:10:27:::347:1330:artis zee:14/02/2019:Coronarographie:BOUSSAID:29/07/1954;71:54:153:1:444: µGy.m²:1:82:::72:72:artis zee:15/02/2019:Coronarographie:SEMAAN:17/02/1948;83:90:162:2:2038: µGy.m²:2:03:::390:390:artis zee:21/02/2019:Coronarographie:SEMAAN:01/12/1936;33:87:173:2:1000: µGy.m²:5:32:::198:377:artis zee:25/02/2019:Coronarographie:BOUSSAID:04/01/1986;75:87:165:2:3863: µGy.m²:8:87:::680:971:artis zee:26/02/2019:Coronarographie:DECHERY:08/03/1944;76:72:165:2:920: µGy.m²:2:27:::179:2006:artis zee:26/02/2019:Coronarographie:DECHERY:16/02/1943;82:73:150:1:157:25: µGy.m²:2:09:::23:23:artis zee:27/02/2019:Coronarographie:DECHERY:02/02/1937;82:80:176:2:3880: µGy.m²:11:97:::680:680:artis zee:27/02/2019:Coronarographie:DECHERY:07/05/1937;57:70:170:2:593: µGy.m²:4:13:::107:173:artis zee:27/02/2019:Coronarographie:BOUSSAID:09/05/1962;67:66:164:2:247: µGy.m²:1:02:::41:175:artis zee:01/03/2019:Coronarographie:MARCOLLET:11/07/1952;81:70:174:2:877: µGy.m²:1:13:::149:149:artis zee:01/03/2019:Coronarographie:DECHERY:15/04/1938;67:55:162:2:297: µGy.m²:0:52:::55:55:artis zee:04/03/2019:Coronarographie:MARCOLLET:14/09/1952;73:100:170:2:1613: µGy.m²:1:75:::264:264:artis zee:06/03/2019:Coronarographie:DECHERY:20/02/1946;74:81:165:2:1124: µGy.m²:3:3:::188:34';

const mockData = uglyString.split(';').map(row => row.split(':'));

const App = () => {
  // const [ headers, setHeaders ] = useState([]);
  const [ data, setData ] = useState([]);

  const formatCSVData = data => {
    data[0] = data[0].filter(header => header !== '');
    const headerLength = data[0].length;
    const formatted = data.map(row => row.splice(0, headerLength));
    setData(formatted);
  };

  const updateData = (newValue, rowIndex, columnIndex) => {
    // console.log(newValue, rowIndex, columnIndex);
    setData(d => 
      d.map((row, r) => (
        r !== rowIndex
          ? row
          : row.map((col, c) => (
            c !== columnIndex
              ? col
              : newValue
      ))))
    );
  };

  const sortData = (i) => {
    console.log('sort', i);
    const sorted = [...data].sort((a, b) => {
      return a[i] < b[i]
        ? 1
        : a[i] > b[i]
          ? -1
          : 0;
    });
    console.log(sorted);
    setData(sorted);
  };

  return (
    <div className="App">
      <CSVReader
        onFileLoaded={data => formatCSVData(data)}
        parserOptions={{skipEmptyLines: true}}/>

      <button onClick={sortData}>sort</button>

      <div style={{height: '1000px'}}>
        <Table
          data={data.length ? data : mockData}
          updateData={updateData}
          sortData={sortData}
        />
      </div>
    </div>
  );
}

export default App;
