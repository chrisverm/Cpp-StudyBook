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
				if ( toc[ i ].innerHTML.search( /\<strike\>/ ) != -1 ) break;
				topic = toc[ i ].textContent.replace( /\W/g, "" ).toLowerCase();
				id = section + "_" + topic;
				
				toc[ i ].innerHTML = "<a href=\"#" + id + "\">" + toc[ i ].innerHTML + "</a>";
				
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

var KEYWORDS = [ "class", "const", "extern", "new", "private", "protected", "public", "return", /*"signed",*/ "static", "struct", "unsigned", "virtual", "void" ];
var DATATYPES = [ "bool", "char", "short", "int", "long", "float", "double" ];
var CASTING = [ "static_cast", "dynamic_cast" ];
var CLASSES = [ "Foobar", "BaseClass", "DerivedClass", "TopLevelClass", "Company", "Animal", "Pet", "Bird", "Cat", "Dog", "string" ];

function colorCode( html )
{
	var list = $( html ).find( "code.block" );
	var block = 0;
	var i = 0, j = 0;
	for ( ; i < list.length; i++ )
	{
		block = list[ i ].textContent + '\n';
		
		// classes
		for ( j = 0; j < CLASSES.length; j++ )
		{
			block = block.replace( new RegExp( CLASSES[ j ], "g" ), "<span class='class'>" + CLASSES[ j ]  + "</span>" );
			block = block.replace( new RegExp( "<span class='class'>" + CLASSES[ j ] + "</span>\\([^\\)]*\\)[^\;]", "g"), function( str ) {
				str = str.replace( /<\/?span[^>]*>/g, "" );
				return str;
			} );
		}
		
		// data types
		for ( j = 0; j < DATATYPES.length; j++ )
		{
			block = block.replace( new RegExp( "[^\w]" + DATATYPES[ j ] + "[^\w]", "g" ), function( str ) {
				return str[ 0 ] + "<span class='datatype'>" + DATATYPES[ j ] + "</span>" + str.slice( -1 ); // str[ str.length - 1 ]
			} );
		}
		
		// keywords
		for ( j = 0; j < KEYWORDS.length; j++ )
		{
			block = block.replace( new RegExp( KEYWORDS[ j ] + "[ |\\:]", "g" ), function( str )
			{
				return "<span class='keyword'>" + KEYWORDS[ j ] + "</span>" + str.slice( -1 );
			} );
		}
		
		// casting keywords
		for ( j = 0; j < CASTING.length; j++ )
		{
			block = block.replace( new RegExp( CASTING[ j ] + "<", "g" ), "<span class=\"cast\">" + CASTING[ j ] + "</span>\<" );
		}
		
		// preprocessor directives
		block = block.replace( /(#include)[^\n]*\n/g, function( str ) {
			str = str.replace( /<\/?span[^>]*>/g, "" );
			str = str.replace( /<([^<]*)>/, function( str2 ) {
				return "<span class='string'>&lt;" + str2.substring( 1, str2.length - 1 ) + "&gt;</span>";
			} );
			return "<span class='preprocessor'>#include</span>" + str.substr( 8 );
		} );
		
		// strings
		block = block.replace( /\"([^\"]+)\"/g, function( str ) {
			str = str.replace( /<\/?span[^>]*>/g, "" );
			return str.replace( /"([^"]+)"/g, "<span class='string'>\"$1\"</span>" );
		} );
		
		// comments
		block = block.replace( /\/\/.*\n/g, function( str ) {
			str = str.replace( /<\/?span[^>]*>/g, "" );
			
			return "<span class='comment'>" + str.slice( 0, -1 ) + "</span>\n";
		});
		
		list[ i ].innerHTML = block;
	}
}