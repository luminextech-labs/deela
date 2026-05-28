package com.deela.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.deela.app.ui.theme.*

private val S_ROBOT = "R"
private val S_SEARCH = "S"
private val S_FIRE = "F"
private val S_CHART = "C"

@Composable
fun HomeScreen(
    onCategoryClick: () -> Unit = {},
    onDealClick: (String) -> Unit = {},
    onSearchClick: () -> Unit = {}
) {
    Column(modifier = Modifier.fillMaxSize().background(Color.White)) {
        SimpleText(text = "deeela", size = 24, bold = true, color = Charcoal, modifier = Modifier.padding(16.dp))
        Row(
            modifier = Modifier
                .padding(horizontal = 16.dp)
                .fillMaxWidth()
                .clip(RoundedCornerShape(50))
                .background(Bg)
                .padding(horizontal = 16.dp, vertical = 12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            SimpleText(text = "Search products...", size = 14, color = TextLight)
        }
        Spacer(modifier = Modifier.height(16.dp))
        Box(
            modifier = Modifier
                .padding(horizontal = 16.dp)
                .fillMaxWidth()
                .height(120.dp)
                .clip(RoundedCornerShape(20.dp))
                .background(brush = Brush.linearGradient(GradientPurplePink))
                .padding(24.dp)
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Column(modifier = Modifier.weight(1f)) {
                    SimpleText(text = "One search find all", size = 18, bold = true, color = Color.White)
                    Spacer(modifier = Modifier.height(4.dp))
                    SimpleText(text = "AI review summaries", size = 12, color = Color.White.copy(alpha = 0.85f))
                }
                SimpleText(text = S_ROBOT, size = 48, color = Color.White)
            }
        }
        Spacer(modifier = Modifier.height(16.dp))
        SimpleText(text = "Today's Deals", size = 15, bold = true, color = Charcoal, modifier = Modifier.padding(horizontal = 16.dp))
        Spacer(modifier = Modifier.height(8.dp))
        Row(
            modifier = Modifier.horizontalScroll(rememberScrollState()).padding(horizontal = 16.dp),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            SimpleDealCard(emoji = "H", price = "690", orig = "1290", platform = "Shopee", disc = "-47%")
            SimpleDealCard(emoji = "P", price = "27900", orig = "32900", platform = "Lazada", disc = "-15%")
            SimpleDealCard(emoji = "L", price = "39900", orig = "44900", platform = "Shopee", disc = "-11%")
        }
        Spacer(modifier = Modifier.height(16.dp))
        SimpleText(text = "Trending", size = 15, bold = true, color = Charcoal, modifier = Modifier.padding(horizontal = 16.dp))
        Spacer(modifier = Modifier.height(8.dp))
        Column(modifier = Modifier.padding(horizontal = 16.dp).clip(RoundedCornerShape(12.dp)).background(Color.White)) {
            SimpleText(text = "1. Portable Fan 2024", size = 13, color = TextDark, modifier = Modifier.padding(10.dp))
            SimpleText(text = "2. Bluetooth Headphones", size = 13, color = TextDark, modifier = Modifier.padding(10.dp))
            SimpleText(text = "3. iPhone 15", size = 13, color = TextDark, modifier = Modifier.padding(10.dp))
        }
        Spacer(modifier = Modifier.height(20.dp))
    }
}

@Composable
private fun SimpleDealCard(emoji: String, price: String, orig: String, platform: String, disc: String) {
    Column(modifier = Modifier.width(130.dp).clip(RoundedCornerShape(16.dp)).background(Color.White)) {
        Box(modifier = Modifier.fillMaxWidth().height(110.dp).background(Bg), contentAlignment = Alignment.Center) {
            SimpleText(text = emoji, size = 44, color = Charcoal)
        }
        Column(modifier = Modifier.padding(10.dp)) {
            SimpleText(text = price, size = 15, bold = true, color = Red)
            SimpleText(text = orig, size = 11, color = TextLight, decoration = TextDecoration.LineThrough)
            SimpleText(text = platform, size = 10, color = TextGray)
        }
    }
}

@Composable
private fun SimpleText(
    text: String,
    size: Int,
    bold: Boolean = false,
    color: Color = TextDark,
    decoration: TextDecoration? = null,
    modifier: Modifier = Modifier
) {
    Text(
        text = text,
        fontSize = size.sp,
        fontWeight = if (bold) FontWeight.Bold else FontWeight.Normal,
        color = color,
        textDecoration = decoration,
        modifier = modifier
    )
}