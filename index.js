var fs = require ('fs'),
    util = require ('util'),
    http = require ('http'),
    moment = require ('moment');

module.exports = function () {  

    var count = 0,
        fileDir = ".capture/";
        
    if (!fs.existsSync (fileDir)) {
        fs.mkdirSync (fileDir);
    }

    return function (req, res, next) {        

        var _write          = res.write,
            _end            = res.end,
            _headersDone    = false;

        var fileName = fileDir + count++ +
                       moment().format ('_YYYY_MM_DD_hh_mm_ss') + "_" +
                       req.method;

        var output = fs.createWriteStream (fileName);

        function outputResHeaders () {
            if (_headersDone == false)
            {
                output.write ('\n<<< response <<<\n');
                output.write (util.format ('HTTP/%s %s %s\r\n',
                              req.httpVersion,
                              res.statusCode,
                              http.STATUS_CODES[res.statusCode]));
                for (var header in res._headers) {
                    output.write (util.format ('%s: %s\r\n',
                                               header,
                                               res._headers[header]));
                }
                output.write ('\r\n');
                _headersDone = true;
            }
        };
        
        output.write ('>>> request >>>\n');
        output.write (util.format ('%s %s HTTP/%s\r\n',
                                   req.method,
                                   req.originalUrl,
                                   req.httpVersion));
        
        for (var header in req.headers) {
            output.write (util.format ('%s: %s\r\n',
                                       header,
                                       req.headers[header]));
        }
        output.write ('\r\n');

        req.on('close', function(){
            res.write = res.end = noop
        });

        req.pipe (output, { end: false });

        res.write = function (chunk) {
            outputResHeaders();
            output.write (chunk.toString());
            _write.apply (res, arguments);
        };

        res.end = function (chunk) {
            outputResHeaders();
            if (chunk) output.write (chunk.toString());
            output.end();
            _end.apply (res, arguments);
        };

        next();
    };
};

function noop(){};
