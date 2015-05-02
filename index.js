var fs = require ('fs'),
    util = require ('util'),
    moment = require ('moment');

module.exports = function () {  

    var count = 0,
        fileDir = ".capture/";
        
    if (!fs.existsSync (fileDir)) {
        fs.mkdirSync (fileDir);
    }
       
    return function (req, res, next) {        

        var fileName = fileDir + count++ +
                       moment().format ('_YYYY_MM_DD_hh_mm_ss') + "_" +
                       req.method;

        var output = fs.createWriteStream (fileName);
        
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
        req.pipe (output, { end: false });

        var _write = res.write,
            _headersDone = false;

        res.write = function (chunk) {
            if (_headersDone == false)
            {
                output.write ('\n<<< response <<<\n');
                output.write (res._header);
                _headersDone = true;
            }
            output.write (chunk.toString());
            _write.apply (res, arguments);
        };
        
        res.on ('finish', function (data) {
            if (_headersDone == false)
            {
                output.write ('\n<<< response <<<\n');                
                output.write (res._header);
                _headersDone = true;
            }
            output.end();
        });
        
        next();
    };
};