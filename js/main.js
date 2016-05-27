function onBodyLoad()
{
	var toc = $( "#toc ul" ).children();
	var section = "", topic = "", id = "";
	for ( var i = 0; i < toc.length; i++ )
	{
		switch( toc[ i ].tagName.toUpperCase() )
		{
			case "H2":
				section = toc[ i ].textContent.replace( /[ |,]/g, "" ).toLowerCase();
				break;
			case "LI":
				topic = toc[ i ].textContent.replace( /[ |,]/g, "" ).toLowerCase();
				id = section + "_" + topic;
				
				toc[ i ].innerHTML = "<a href=\"#" + id + "\">" + toc[ i ].innerHTML + "</a>";
				
				//alert( "./content/" + section + "/" + topic + ".html" );
				
				$( "#content" ).append( "<div id=\"" + id + "\"></div>" );
				$( "#content" ).append( "<hr>" );
				$( "#" + id ).load( "./content/" + section + "/" + topic + ".html", function( response, status, xhr )
				{
					if ( status != "error" )
					{
						colorCode( this );
					}
				} );
				break;
		}
	}
}

function colorCode( html )
{
	//alert( this );
}