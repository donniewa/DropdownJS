/**
 * @author Donald White
 */
/*global $, jQuery, require, window */
(function( $ ){
    var settings    =   {
        timeout: 500,
        scrollTriggerHeight: 200,
        dropdownClass: 'dropdown',
        fadeInSpeed: 'fast',
        fadeOutSpeed: 'fast'
    };
    var originalElements = null;

    var methods = {
        init : function( options ) {
           return this.each(function(){
                var $this = $(this),
                    data = $this.data('dropdown');
             
                // If the plugin hasn't been initialized yet
                if ( ! data ) {
                    
                    $this.mouseover(function(){
                        $this.dropdown('open');
                    });
    
                    $this.mouseout(function(){
                        $this.dropdown('startTimer');
                    });
                    
                    /**
                     * Position the dropdown here
                     */
                    var _height = $this.outerHeight();
                    var _width = $this.outerWidth();
                    
                    var _dropMenu   =   $('.' + settings.dropdownClass, $this);
                    var _dropMenuCss=   {
                        'top': _height,
                        'min-width': (_width-1),
                        'left': -1
                    };
                    _dropMenu.css(_dropMenuCss);
                    
                    // Do more setup stuff here
                    $(this).data('dropdown', {
                        target : $this,
                        settings : $.extend(settings, options)
                    });
                }
            });
        },
         
        destroy : function( ) {
             return this.each(function(){
                 var $this = $(this),
                     data = $this.data('dropdown');
                 // Namespacing FTW
                 $(window).unbind('.dropdown');
                 data.dropdown.remove();
                 $this.removeData('dropdown');
            });
        },
         
        open : function() {
            var $this = $(this),
                _data =  $this.data('dropdown'),
                elem = _data.target;
                
            elem.dropdown('cancelTimer');
            var _dropMenu   =   $('.' + settings.dropdownClass, elem);
            _dropMenu.fadeIn(settings.fadeInSpeed);
            elem.dropdown('calculateHeight', _dropMenu);
        },
        
        calculateHeight : function(_dropMenu) {
            var $this = $(this),
                _data =  $this.data('dropdown'),
                elem = _data.target;

            /**
             * Height Calculations
             */
            var _dropHeight = 0;
            var _dropIHeight = 0;
            if (_dropMenu.data('originalHeight') !== undefined) {
                _dropHeight     =   _dropMenu.data('originalHeight');
                _dropIHeight    =   _dropMenu.data('originalInnerHeight');
            } else {
                _dropHeight     =   _dropMenu.outerHeight();
                _dropMenu.data('originalHeight', _dropHeight);
                
                _dropIHeight     =   _dropMenu.height();
                _dropMenu.data('originalInnerHeight', _dropIHeight);
            }
            
            var _currentHeight  =   _dropMenu.height();
            var _dropOffset     =   _dropMenu.offset();
            var _dropPosition   =   _dropMenu.position();
            var _windowHeight   =   $(window).height();
            var _windowScroll   =   $(window).scrollTop();

            if (_dropOffset !== null) {
                var _offsetHeight       =   ((_dropOffset.top - _windowScroll) + _dropHeight);
                var _heightDifference   =   _offsetHeight - _windowHeight;
                var _newHeight          =   _dropHeight - _heightDifference;
                if (_offsetHeight >= _windowHeight && _newHeight != _currentHeight) {
                    _dropMenu.scrollTop(0);
                    _dropMenu.css({
                        overflow : 'auto'
                    }).animate({
                        height: _newHeight
                    });
                } else if (_currentHeight <= _dropIHeight && _offsetHeight < _windowHeight) {
                    // Set the menu back to normal here.
                    _dropMenu.scrollTop(0);
                    _dropMenu.css({
                        overflow : 'visible'
                    }).animate({
                        height: _dropIHeight
                    });
                }
            }
        },
        
        close : function() { 
            var $this = $(this),
                _data =  $this.data('dropdown'),
                elem = _data.target;
            $('.' + settings.dropdownClass, elem).fadeOut(settings.fadeOutSpeed);
        },

        hide : function() { 
            var $this = $(this),
                _data =  $this.data('dropdown'),
                elem = _data.target;
            $('.' + settings.dropdownClass, elem).hide();
        },
        
        startTimer : function() { 
            var $this = $(this),
                _data =  $this.data('dropdown'),
                elem = _data.target;
            elem.data('timer', window.setTimeout(function(){
                elem.dropdown('close');
            }, settings.timeout));
        },
        
        cancelTimer : function() { 
            var $this = $(this),
                _data =  $this.data('dropdown'),
                elem = _data.target;
            if (elem.data('timer') !== undefined) {
                window.clearTimeout(elem.data('timer'));
            }
            
            elem.data('timer', null);
        }
    };

    $.fn.dropdown = function( method ) {
        if ( methods[method] ) {
          return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
          return methods.init.apply( this, arguments );
        } else {
          $.error( 'Method ' +  method + ' does not exist on jQuery.dropdown' );
        }    
    };
})( jQuery );