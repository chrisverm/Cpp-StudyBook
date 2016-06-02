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
		
		// strings
		block = block.replace( /\n[^\n|\/\/]*\"[^\"|\n]*\"/g, function( str ) {
			str = str.replace( /\"[^\"]*\"/g, function( str2 ) {
				return "<span class=\"string\">" + str2 + "</span>";
			} );
			
			return str;
		} );
		
		// comments
		block = block.replace( /\/\/.*\n/g, function( str ) {
			return "<span class=\"comment\">" + str.slice( 0, -1 ) + "</span>\n";
		});
		
		// preprocessor directives
		block = block.replace( /[^\n]*\#include[^\n]*\n/g, function( str ) {
			if ( str.search( "\/\/" ) != -1 ) return str.replace( /\</, "&lt;" ).replace( /\>/, "&gt;" );
			return "<span class=\"preprocessor\">#include</span><span class=\"include\">" + str.replace( /\</, "&lt;" ).replace( /\>/, "&gt;" ).substr( 8 ) + "</span>";
		} );
		
		// classes
		for ( j = 0; j < CLASSES.length; j++ )
		{
			// [ClassName] variable | [ClassName]* variable | [ClassName]::Method
			block = block.replace( new RegExp( CLASSES[ j ] + "( [a-z]|\\* |\:\:)", "g" ), function( str ) {
				return "<span class=\"class\">" + str.substring( 0, str.length - 2 ) + "</span>" + str.slice( -2 );
			} );
			
			// new [ClassName]
			block = block.replace( new RegExp( "new " + CLASSES[ j ], "g" ), function( str ) {
				return "new <span class=\"class\">" + str.substring( 4, str.length ) + "</span>";
			} );
			
			// class [ClassName]
			block = block.replace( new RegExp( "class " + CLASSES[ j ], "g" ), function( str ) {
				return "class <span class=\"class\">" + str.substring( 6, str.length ) + "</span>";
			} );
			
			// public [ClassName]
			block = block.replace( new RegExp( "public " + CLASSES[ j ], "g" ), function( str ) {
				return "public <span class=\"class\">" + str.substring( 7, str.length ) + "</span>";
			} );
		}
		
		// data types
		for ( j = 0; j < DATATYPES.length; j++ )
		{
			block = block.replace( new RegExp( DATATYPES[ j ] + "[^a-z]", "g" ), function( str ) {
				return "<span class=\"datatype\">" + DATATYPES[ j ] + "</span>" + str.slice( -1 );
			} );
		}
		
		// keywords
		for ( j = 0; j < KEYWORDS.length; j++ )
		{
			block = block.replace( new RegExp( KEYWORDS[ j ] + "[ |\\:]", "g" ), function( str )
			{
				return "<span class=\"keyword\">" + KEYWORDS[ j ] + "</span>" + str.slice( -1 );
			} );
		}
		
		// casting keywords
		for ( j = 0; j < CASTING.length; j++ )
		{
			block = block.replace( new RegExp( CASTING[ j ] + "<", "g" ), "<span class=\"cast\">" + CASTING[ j ] + "</span>\<" );
		}
		
		
		/*
		// preprocessor directives
		block = block.replace( /[^\n]*\#include[^\n]*\n/g, function( str ) {
			if ( str.search( "\/\/" ) != -1 ) return str.replace( /\</, "&lt;" ).replace( /\>/, "&gt;" );
			return "<span class=\"preprocessor\">#include</span><span class=\"include\">" + str.replace( /\</, "&lt;" ).replace( /\>/, "&gt;" ).substr( 8 ) + "</span>";
		} );
		
		// keywords
		for ( j = 0; j < KEYWORDS.length; j++ )
		{
			block = block.replace( new RegExp( KEYWORDS[ j ] + "[ |\\:]", "g" ), function( str )
			{
				return "<span class=\"keyword\">" + KEYWORDS[ j ] + "</span>" + str.slice( -1 );
			} );
		}
		
		// data types
		for ( j = 0; j < DATATYPES.length; j++ )
		{
			block = block.replace( new RegExp( DATATYPES[ j ] + "[^a-z]", "g" ), function( str ) {
				return "<span class=\"datatype\">" + DATATYPES[ j ] + "</span>" + str.slice( -1 );
			} );
		}
		
		// casting keywords
		for ( j = 0; j < CASTING.length; j++ )
		{
			block = block.replace( new RegExp( CASTING[ j ] + "<", "g" ), "<span class=\"cast\">" + CASTING[ j ] + "</span>\<" );
		}
		
		// classes
		for ( j = 0; j < CLASSES.length; j++ )
		{
			block = block.replace( new RegExp( "[^\:\:|\"|a-z]" + CLASSES[ j ] + "[^\.|a-z]", "g" ), function( str ) {
				//alert( str );
				return str[ 0 ] + "<span class=\"class\">" + str.substr( 1, str.length - 2 ) + "</span>" + str[ str.length - 1];
			});
		}
		*/
		
		list[ i ].innerHTML = block;
	}
}