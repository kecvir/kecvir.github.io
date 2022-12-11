
var schema_=null;

var json2tbl=( data,schema )=>{
    var items = [];
    keys=Object.keys(data[0])
    items.push('<tr>')
    keys.forEach(k=>{
      items.push(`<th>${k}</th>`)
    });
    //items.push(`<th>rbr</th></tr>`)
    
    var ii=1;
    data.forEach(d=>{
      items.push('<tr>')
      keys.forEach(k=>{
        if (schema[k]=='href') {
          var title=d[k].split('/').slice(-1)
          var href=`<a href="${d[k]}" target="_blank">${title}</a>`
          items.push(`<td>${href}</td>`)
        }
        else if (schema[k]=='textarea') {
          var ta=`<textarea cols=50 rows=5>${d[k]}</textarea>`
          items.push(`<td>${ta}</td>`)
        }
        else
          items.push(`<td>${d[k]}</td>`)
      });
      //items.push(`<td>${ii++}</td></tr>`)
    });
    
    $("#tbl-container").append(`<table id="dataTbl" border="1">${items.join("")}</table>`);
    $("#tbl-container").append(`<button id="btn-save">save</button>`);
    isOk();
};

$.getJSON( "./data.json", ( data )=> {
  $.getJSON( "./schema.json", ( schema )=> {
    schema_=schema;
    json2tbl( data, schema );
  });
});

  $(document).ready( () => {
    $("#tbl-container").on('click',"#btn-save",()=>{
        //create_download_link( bind_data_back() );
        create_download_link( tbl2json( "#dataTbl", schema_ ) );
    });
    
  });
 
  var bind_data_back=()=>{
    data=[];
    $("tr").each((index, tr)=>{
        var d={}
        $(tr).find("td").each((i1,td)=>{
            if (i1==0) d['id']= parseInt( $(td).text() );
            else if ( i1==1 ) d['link']=$(td).find("a").attr('href');
            else if ( i1==2 ) d['comment']=$(td).find('textarea').val()?.trim();
        });
        if (!isNaN(d['id']))
            data.push(d);
    });
    return data;
  }

  var create_download_link=(data)=>{
    var url = "data:text/plain;charset=utf-8," + encodeURIComponent( JSON.stringify(data,null,4) );
    $("#res-container").append(`
    <a href="${url}" download="data.json">
        download data
    </a><br>
    `.trim());
  };


var tbl2json=( tbl, schema )=>{
  var keys=$(tbl).find("th").map( (i,th) => $(th).text() );
  data=[]
  $(tbl).find("tr").each( (i,tr) =>{
    var ks=$(tr).find("th").map( (i,th) => $(th).text() )
    if (ks.length>0) return;
    var _data={}
    var vals=$(tr).find("td").map( (i,td) => {
        var k=keys[i];
        if (schema[k]=='href'){
          _data[k]=$(td).find("a").attr('href')
        }
        else if (schema[k]=='textarea'){
          _data[k]=$(td).find('textarea').val()?.trim();
        }
        else
          _data[k]=$(td).text()?.trim();
    })
    data.push( _data )
  })
  return data;
} 

var isOk=()=>{
   $("#dataTbl").find("textarea").each( (i,ta)=> {
    var tx=$(ta).val();
    if (tx.includes('OK')){
      $(ta).parent().parent().css("background-color", "#99ffcc")
    }
  });
}

var average_price=()=>{
  data=tbl2json( "#dataTbl", schema_ )
  price=Array.from(new Set(data.map(p=>parseInt(p['eur_per_m2']))))
  return price.reduce((a, b) => a + b, 0)/price.length
}

var tbl2json_by_ra=(rate)=>{
  data=tbl2json( "#dataTbl", schema_ ).filter(x=> x['rate']==rate);

  var url = "data:text/plain;charset=utf-8," + encodeURIComponent( JSON.stringify(data,null,4) );
    $("#res-container").append(`
    <a href="${url}" download="data.json">
        download data, rate: ${rate}
    </a><br>
    `.trim());
  return data
}

var tbl2json_by_id=(id)=>{
  data=tbl2json( "#dataTbl", schema_ ).filter(x=> x['id']==id);

  var url = "data:text/plain;charset=utf-8," + encodeURIComponent( JSON.stringify(data,null,4) );
    $("#res-container").append(`
    <a href="${url}" download="data.json">
        download data, id: ${id}
    </a><br>
    `.trim());
  return data
}
