package com.tvfree.app

import android.os.Bundle
import android.view.WindowManager
import android.widget.FrameLayout
import androidx.appcompat.app.AppCompatActivity
import com.google.android.exoplayer2.ExoPlayer
import com.google.android.exoplayer2.source.MediaSource
import com.google.android.exoplayer2.source.hls.HlsMediaSource
import com.google.android.exoplayer2.upstream.DefaultHttpDataSource
import com.google.android.exoplayer2.util.Util
import com.google.android.exoplayer2.ui.PlayerView

class MainActivity : AppCompatActivity() {

    private var player: ExoPlayer? = null
    private var playerView: PlayerView? = null
    private var playWhenReady = true
    private var currentWindow = 0
    private var playbackPosition = 0L

    private val streamUrl = "https://thaipbs-mcx0wm.cdn.byteark.com/live/playlist.m3u8"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)

        playerView = PlayerView(this).apply {
            layoutParams = FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.MATCH_PARENT
            )
            useController = true
        }

        setContentView(playerView)
    }

    override fun onStart() {
        super.onStart()
        initializePlayer()
    }

    override fun onResume() {
        super.onResume()
        hideSystemUi()
        if (player == null) {
            initializePlayer()
        }
    }

    override fun onPause() {
        super.onPause()
        player?.let {
            playbackPosition = it.currentPosition
            currentWindow = it.currentWindowIndex
            playWhenReady = it.playWhenReady
        }
        player?.pause()
    }

    override fun onStop() {
        super.onStop()
        releasePlayer()
    }

    override fun onDestroy() {
        super.onDestroy()
        releasePlayer()
    }

    private fun hideSystemUi() {
        window.decorView.systemUiVisibility = (android.view.View.SYSTEM_UI_FLAG_FULLSCREEN
                or android.view.View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                or android.view.View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                or android.view.View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                or android.view.View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                or android.view.View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION)
    }

    private fun initializePlayer() {
        if (player != null) return

        player = ExoPlayer.Builder(this).build().apply {
            playerView?.player = this

            val dataSourceFactory = DefaultHttpDataSource.Factory()
                .setAllowCrossProtocolRedirects(true)
                .setConnectTimeoutMs(15000)
                .setReadTimeoutMs(15000)

            val mediaItem = com.google.android.exoplayer2.MediaItem.fromUri(streamUrl)
            val mediaSource = HlsMediaSource.Factory(dataSourceFactory)
                .createMediaSource(mediaItem)

            setMediaSource(mediaSource)
            setPlayWhenReady(playWhenReady)
            seekTo(currentWindow, playbackPosition)
            prepare()
        }
    }

    private fun releasePlayer() {
        player?.let {
            playbackPosition = it.currentPosition
            currentWindow = it.currentWindowIndex
            playWhenReady = it.playWhenReady
            it.release()
        }
        player = null
        playerView?.player = null
    }
}
