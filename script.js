$(function() {
    // PeerJS object
    let username = 'Eloike-'+String(Math.floor(Math.random()*100))
    var peer = new Peer(username, {
        host: 'localhost',
        port: 9000,
        path: '/peerjs',
        debug: 3,
        config: {
            'iceServers': [{
                    url: 'stun:stun1.l.google.com:19302'
                },
                {
                    url: 'turn:numb.viagenie.ca',
                    credential: 'muazkh',
                    username: 'webrtc@live.com'
                }
            ]
        }
    });
    peer.on('open', ()=> {
        $('#my-id').text(peer.id);
    });
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    peer.on('call', call=> {
        var r = confirm("Receive a call?");
        if (r == true) {
            call.answer(window.localStream);
            onReceiveStream(call);
        } else {
            window.existingCall.close();
            onStart();
        }
    });
    peer.on('error', err=>{
        alert(err.message);
        onStart();
    });
    getVideo();
    $('#make-call').click(()=> {
        // Initiate a call!
        var call = peer.call($('#callto-id').val(), window.localStream);
        onReceiveStream(call);
    });
    $('#end-call').click(()=> {
        window.existingCall.close();
        onStart();
    });

    function getVideo() {
        navigator.getUserMedia({
                audio: true,
                video: true
            },
            function(stream) {
                // Set your video chat application displays
                var video = $('#my-video' + ' video')[0];
                console.log(stream);
                console.log(video);
                try{
                    video.srcObject = stream;
                } catch{
                  
                video.src = window.URL.createObjectURL(stream);  
            }
                window.localStream = stream;
                onStart();
            },
            function(error) {
                $('#start-error').show();
            });
    }

    function onStart() {
        $('#start, #receive-call').hide();
        $('#config').show();
    }

    function onReceiveStream(call) {
        if (window.existingCall) {
            window.existingCall.close();
        }
        // Wait for stream on the call, then set peer video display
        call.on('stream', stream=>{
            var video1 = $('#peer-video' + ' video')[0];
            try{
                video1.srcObject = stream;
            } catch{              
                video1.src = window.URL.createObjectURL(stream);  
           }
        });
        window.existingCall = call;
        $('#peer-id').text(call.peer);
        call.on('close', onStart);
        $('#start, #config').hide();
        $('#receive-call').show();
    }
});
